const express = require('express');
const https = require('https');
const net = require('net');
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

// Authoritative RDAP servers per TLD (HTTPS — never blocked by firewalls)
const RDAP_SERVERS = {
    '.com': 'https://rdap.verisign.com/com/v1/domain/',
    '.net': 'https://rdap.verisign.com/net/v1/domain/',
    '.org': 'https://rdap.publicinterestregistry.org/rdap/domain/',
    '.io':  'https://rdap.nic.io/domain/',
    '.co':  'https://rdap.nic.co/domain/',
    // .ba has no public RDAP server — falls back to WHOIS
};

// WHOIS TCP servers (port 43) — used when RDAP is unavailable
const WHOIS_SERVERS = {
    '.com': 'whois.verisign-grs.com',
    '.net': 'whois.verisign-grs.com',
    '.org': 'whois.pir.org',
    '.ba':  'whois.nic.ba',
    '.io':  'whois.nic.io',
    '.co':  'whois.nic.co',
};

// Substrings indicating domain IS registered
const REGISTERED_PATTERNS = [
    'domain name:', 'domain:', 'registrar:', 'creation date:',
    'created:', 'expires:', 'expiry date:', 'name server:',
    'nserver:', 'registrant:', 'status: active', 'status: registered',
    'last-modified:', 'handle:',
];

// Substrings indicating domain is NOT registered (available)
const FREE_PATTERNS = [
    'no match', 'not found', 'no entries found', 'domain not found',
    'no data found', 'status: free', 'object does not exist',
    '% no such domain', 'is available', 'no information available',
    'domain is available', 'status: available',
];

/** RDAP via authoritative HTTPS endpoint — 200=taken, 404=available */
function checkViaRDAP(domain, baseUrl) {
    return new Promise((resolve) => {
        const url = `${baseUrl}${domain}`;
        const req = https.get(
            url,
            { timeout: 8000, headers: { Accept: 'application/rdap+json', 'User-Agent': 'LuminorDomainChecker/1.0' } },
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

/** WHOIS TCP on port 43 — fallback when no RDAP server available */
function checkViaWHOIS(domain, server) {
    return new Promise((resolve) => {
        let data = '';
        const client = net.createConnection({ host: server, port: 43 }, () => {
            client.write(`${domain}\r\n`);
        });
        client.setTimeout(9000);
        client.on('data', (chunk) => { data += chunk.toString('utf8'); });
        client.on('end', () => {
            if (!data.trim()) return resolve('unknown');
            const lower = data.toLowerCase();
            if (FREE_PATTERNS.some((p) => lower.includes(p)))       return resolve('available');
            if (REGISTERED_PATTERNS.some((p) => lower.includes(p))) return resolve('taken');
            resolve('unknown');
        });
        client.on('error', () => resolve('unknown'));
        client.on('timeout', () => { client.destroy(); resolve('unknown'); });
    });
}

/**
 * @route   GET /api/domain/check?name=example
 * @desc    Check domain availability via RDAP (primary) + WHOIS fallback
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
            error: 'Please enter a valid domain name (at least 2 characters).'
        });
    }

    const results = await Promise.all(
        TLDS.map(async (tld) => {
            const full = `${baseName}${tld}`;
            let status = 'unknown';

            const rdapBase = RDAP_SERVERS[tld];
            if (rdapBase) {
                status = await checkViaRDAP(full, rdapBase);
            }

            // Fallback to WHOIS if RDAP is unavailable or returned unknown
            if (status === 'unknown') {
                const whoisServer = WHOIS_SERVERS[tld];
                if (whoisServer) status = await checkViaWHOIS(full, whoisServer);
            }

            return { domain: full, tld, status };
        })
    );

    res.json({ success: true, baseName, results });
});

module.exports = router;
