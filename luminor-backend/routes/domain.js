const express = require('express');
const https = require('https');
const dns = require('dns').promises;
const rateLimit = require('express-rate-limit');

const router = express.Router();

const domainCheckLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { success: false, error: 'Too many domain checks, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

const POPULAR_TLDS = ['.com', '.net', '.org', '.ba', '.io', '.co'];

const EXTENDED_TLDS = [
    '.com', '.net', '.org', '.io', '.co', '.me',
    '.ba', '.hr', '.rs', '.si', '.eu',
    '.de', '.fr', '.uk', '.at', '.nl', '.it', '.es',
    '.info', '.biz', '.online', '.store', '.app', '.dev', '.tech',
    '.gg', '.tv', '.shop', '.agency', '.digital', '.studio', '.media', '.solutions',
];

const RDAP_SERVERS = {
    '.com': 'https://rdap.verisign.com/com/v1/domain/',
    '.net': 'https://rdap.verisign.com/net/v1/domain/',
    '.org': 'https://rdap.publicinterestregistry.org/rdap/domain/',
};

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

async function checkViaDNS(domain) {
    try {
        await dns.resolveNs(domain);
        return 'taken';
    } catch (nsErr) {
        if (nsErr.code === 'ENOTFOUND') return 'available';
        try {
            await dns.resolve4(domain);
            return 'taken';
        } catch (aErr) {
            if (aErr.code === 'ENOTFOUND') return 'available';
            return 'unknown';
        }
    }
}

async function checkDomain(baseName, tld) {
    const full = `${baseName}${tld}`;
    let status = 'unknown';
    const rdapBase = RDAP_SERVERS[tld];
    if (rdapBase) status = await checkViaRDAP(full, rdapBase);
    if (status === 'unknown') status = await checkViaDNS(full);
    return { domain: full, tld, status };
}

/**
 * @route   GET /api/domain/check?name=example[.gg]&extended=true
 * @desc    Check domain availability.
 *          - Detects specific TLD from input (e.g. "techplay.gg" → featured: .gg)
 *          - extended=true checks 32 TLDs sorted available-first
 * @access  Public
 */
router.get('/check', domainCheckLimiter, async (req, res) => {
    const { name, extended } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ success: false, error: 'Domain name is required.' });
    }

    const cleaned = name.toLowerCase()
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '');

    const dotIndex = cleaned.indexOf('.');
    const rawBase = dotIndex > -1 ? cleaned.slice(0, dotIndex) : cleaned;
    const specificTld = dotIndex > -1 ? cleaned.slice(dotIndex) : null;

    const baseName = rawBase
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+|-+$/g, '')
        .slice(0, 63);

    if (!baseName || baseName.length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Please enter a valid domain name (at least 2 characters).',
        });
    }

    const isExtended = extended === 'true';
    const tldList = isExtended ? EXTENDED_TLDS : POPULAR_TLDS;

    // Include specific TLD in checks if not already in the list
    const tldToCheck = specificTld && !tldList.includes(specificTld)
        ? [specificTld, ...tldList]
        : tldList;

    const allResults = await Promise.all(
        tldToCheck.map((tld) => checkDomain(baseName, tld))
    );

    let featured = null;
    let results = allResults;

    if (specificTld) {
        featured = allResults.find((r) => r.tld === specificTld) || null;
        results = allResults.filter((r) => r.tld !== specificTld);
        if (!isExtended) {
            results = results.filter((r) => POPULAR_TLDS.includes(r.tld));
        }
    }

    // Sort extended results: available → unknown → taken
    if (isExtended) {
        const order = { available: 0, unknown: 1, taken: 2 };
        results.sort((a, b) => (order[a.status] ?? 1) - (order[b.status] ?? 1));
    }

    res.json({ success: true, baseName, featured, results });
});

module.exports = router;
