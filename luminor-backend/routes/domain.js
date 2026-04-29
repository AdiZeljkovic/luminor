const express = require('express');
const https = require('https');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const domainCheckLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, error: 'Too many domain checks, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

const TLDS = ['.com', '.net', '.org', '.ba', '.io', '.co'];

// Authoritative RDAP servers for TLDs that support it (HTTPS, never blocked)
const RDAP_SERVERS = {
    '.com': 'https://rdap.verisign.com/com/v1/domain/',
    '.net': 'https://rdap.verisign.com/net/v1/domain/',
    '.org': 'https://rdap.publicinterestregistry.org/rdap/domain/',
    '.io':  'https://rdap.nic.io/domain/',
    '.co':  'https://rdap.nic.co/domain/',
    // .ba has no RDAP server — uses HTTP WHOIS proxy below
};

/**
 * RDAP via authoritative HTTPS endpoint.
 * 200 = domain is registered (taken)
 * 404 = domain not found in registry (available)
 */
function checkViaRDAP(domain, baseUrl) {
    return new Promise((resolve) => {
        const req = https.get(
            `${baseUrl}${domain}`,
            {
                timeout: 8000,
                headers: {
                    Accept: 'application/rdap+json',
                    'User-Agent': 'LuminorDomainChecker/1.0',
                },
            },
            (res) => {
                res.resume();
                if (res.statusCode === 200) resolve('taken');
                else if (res.statusCode === 404) resolve('available');
                else resolve('unknown');
            }
        );
        req.on('error', () => resolve('unknown'));
        req.on('timeout', () => { req.destroy(); resolve('unknown'); });
    });
}

/**
 * HTTP WHOIS proxy via who-dat.as93.net.
 * This service makes WHOIS TCP queries from its own servers, so our VPS
 * firewall blocking port 43 is irrelevant — we only need HTTPS port 443.
 * Used for .ba (no RDAP) and as fallback when RDAP returns unknown.
 */
function checkViaWHOISProxy(domain) {
    return new Promise((resolve) => {
        let raw = '';
        const req = https.get(
            `https://who-dat.as93.net/${domain}`,
            {
                timeout: 12000,
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'LuminorDomainChecker/1.0',
                },
            },
            (res) => {
                res.on('data', (chunk) => { raw += chunk.toString(); });
                res.on('end', () => {
                    // HTTP 404 from the proxy = domain not registered
                    if (res.statusCode === 404) return resolve('available');
                    try {
                        const json = JSON.parse(raw);
                        // who-dat returns { error: "No match for..." } for unregistered domains
                        if (json.error) return resolve('available');
                        // Registered domains have at least domain_name or registrar
                        const hasData = !!(
                            json.domain_name || json.registrar ||
                            json.creation_date || json.updated_date
                        );
                        resolve(hasData ? 'taken' : 'unknown');
                    } catch {
                        resolve('unknown');
                    }
                });
            }
        );
        req.on('error', () => resolve('unknown'));
        req.on('timeout', () => { req.destroy(); resolve('unknown'); });
    });
}

/**
 * @route   GET /api/domain/check?name=example
 * @desc    Check domain availability across popular TLDs
 *          RDAP (HTTPS) → HTTP WHOIS proxy fallback → unknown
 * @access  Public
 */
router.get('/check', domainCheckLimiter, async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ success: false, error: 'Domain name is required.' });
    }

    const baseName = name
        .toLowerCase()
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('.')[0]
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+|-+$/g, '')
        .slice(0, 63);

    if (!baseName || baseName.length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Please enter a valid domain name (at least 2 characters).',
        });
    }

    const results = await Promise.all(
        TLDS.map(async (tld) => {
            const full = `${baseName}${tld}`;
            let status = 'unknown';

            // 1. Try authoritative RDAP (fast, reliable for supported TLDs)
            const rdapBase = RDAP_SERVERS[tld];
            if (rdapBase) {
                status = await checkViaRDAP(full, rdapBase);
            }

            // 2. Fallback: HTTP WHOIS proxy (handles .ba and any RDAP failure)
            if (status === 'unknown') {
                status = await checkViaWHOISProxy(full);
            }

            return { domain: full, tld, status };
        })
    );

    res.json({ success: true, baseName, results });
});

module.exports = router;
