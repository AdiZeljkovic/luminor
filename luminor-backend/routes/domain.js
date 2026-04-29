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

function checkViaRDAP(domain) {
    return new Promise((resolve) => {
        const req = https.get(
            `https://rdap.org/domain/${domain}`,
            { timeout: 6000, headers: { 'User-Agent': 'LuminorDomainChecker/1.0' } },
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

async function checkViaDNS(domain) {
    try {
        await dns.resolve(domain, 'NS');
        return 'taken';
    } catch {
        try {
            await dns.resolve(domain, 'A');
            return 'taken';
        } catch {
            return 'available';
        }
    }
}

/**
 * @route   GET /api/domain/check?name=example
 * @desc    Check domain availability across popular TLDs
 * @access  Public
 */
router.get('/check', domainCheckLimiter, async (req, res) => {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ success: false, error: 'Domain name is required.' });
    }

    // Sanitize: strip protocol/www/TLD, keep only the label
    const baseName = name
        .toLowerCase()
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('.')[0]
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+|-+$/g, '') // no leading/trailing hyphens
        .slice(0, 63);

    if (!baseName || baseName.length < 2) {
        return res.status(400).json({ success: false, error: 'Please enter a valid domain name (at least 2 characters).' });
    }

    const results = await Promise.all(
        TLDS.map(async (tld) => {
            const full = `${baseName}${tld}`;
            let status = await checkViaRDAP(full);
            if (status === 'unknown') {
                status = await checkViaDNS(full);
            }
            return { domain: full, tld, status };
        })
    );

    res.json({ success: true, baseName, results });
});

module.exports = router;
