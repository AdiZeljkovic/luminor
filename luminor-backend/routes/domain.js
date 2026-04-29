const express = require('express');
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

// WHOIS servers for each TLD (TCP port 43)
const WHOIS_SERVERS = {
    '.com': 'whois.verisign-grs.com',
    '.net': 'whois.verisign-grs.com',
    '.org': 'whois.pir.org',
    '.ba':  'whois.nic.ba',
    '.io':  'whois.nic.io',
    '.co':  'whois.nic.co',
};

// Substrings in a WHOIS response that indicate the domain is NOT registered
const FREE_PATTERNS = [
    'no match',
    'not found',
    'no entries found',
    'domain not found',
    'no data found',
    'status: free',
    'object does not exist',
    'no object found',
    'this domain name has not been registered',
    'domain name not found',
    '% no such domain',
    'no information available',
    'domain is available',
];

/**
 * WHOIS TCP lookup — the authoritative source for domain registration data.
 * Connects to the registry's WHOIS server on port 43, sends "domain\r\n",
 * reads the response and checks for "not found" patterns.
 */
function checkViaWHOIS(domain, server) {
    return new Promise((resolve) => {
        let data = '';

        const client = net.createConnection({ host: server, port: 43 }, () => {
            client.write(`${domain}\r\n`);
        });

        client.setTimeout(8000);

        client.on('data', (chunk) => {
            data += chunk.toString('utf8');
        });

        client.on('end', () => {
            const lower = data.toLowerCase();
            const isFree = FREE_PATTERNS.some((p) => lower.includes(p));
            // If we got a non-empty response with no "free" patterns, domain is taken
            resolve(data.trim().length > 0 ? (isFree ? 'available' : 'taken') : 'unknown');
        });

        client.on('error', () => resolve('unknown'));
        client.on('timeout', () => { client.destroy(); resolve('unknown'); });
    });
}

/**
 * @route   GET /api/domain/check?name=example
 * @desc    Check domain availability across popular TLDs via WHOIS
 * @access  Public
 */
router.get('/check', domainCheckLimiter, async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ success: false, error: 'Domain name is required.' });
    }

    // Sanitize: strip protocol/www/TLD — keep only the second-level label
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
            const server = WHOIS_SERVERS[tld];
            const status = server ? await checkViaWHOIS(full, server) : 'unknown';
            return { domain: full, tld, status };
        })
    );

    res.json({ success: true, baseName, results });
});

module.exports = router;
