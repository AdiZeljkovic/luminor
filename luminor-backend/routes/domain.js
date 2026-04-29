const express = require('express');
const https = require('https');
const dns = require('dns').promises;
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

// Authoritative RDAP servers for TLDs that support it
const RDAP_SERVERS = {
    '.com': 'https://rdap.verisign.com/com/v1/domain/',
    '.net': 'https://rdap.verisign.com/net/v1/domain/',
    '.org': 'https://rdap.publicinterestregistry.org/rdap/domain/',
    // .io, .co, .ba — RDAP unreachable from this VPS; DNS fallback used instead
};

/**
 * RDAP via authoritative HTTPS endpoint.
 * 200 = registered (taken), 404 = not found (available)
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
 * DNS NS lookup — works for every TLD, no third-party dependency, port 53 always open.
 * NXDOMAIN (ENOTFOUND) = domain doesn't exist in DNS = available to register.
 * NS records present = domain is delegated to a registrar = taken.
 * ENODATA = domain exists in parent zone but no NS configured; try A record.
 */
async function checkViaDNS(domain) {
    try {
        await dns.resolveNs(domain);
        return 'taken';
    } catch (nsErr) {
        if (nsErr.code === 'ENOTFOUND') return 'available';
        // ENODATA: SOA exists but no NS yet — check for A/AAAA as secondary signal
        try {
            await dns.resolve4(domain);
            return 'taken';
        } catch (aErr) {
            if (aErr.code === 'ENOTFOUND') return 'available';
            return 'unknown';
        }
    }
}

/**
 * @route   GET /api/domain/check?name=example
 * @desc    Check domain availability across popular TLDs
 *          Strategy: RDAP (for .com/.net/.org) → DNS NS lookup (all TLDs)
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

            // 1. RDAP — fast and authoritative for .com/.net/.org
            const rdapBase = RDAP_SERVERS[tld];
            if (rdapBase) {
                status = await checkViaRDAP(full, rdapBase);
            }

            // 2. DNS NS lookup — universal fallback, no external service needed
            if (status === 'unknown') {
                status = await checkViaDNS(full);
            }

            return { domain: full, tld, status };
        })
    );

    res.json({ success: true, baseName, results });
});

module.exports = router;
