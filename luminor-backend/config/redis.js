const { createClient } = require('redis');

// Initialize Redis Client
// Defaults to localhost:6379 if REDIS_URL not set
const client = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

client.on('error', (err) => {
    // Prevent app crash if Redis is down
    console.error('⚠️ Redis Client Error', err);
});

client.on('connect', () => {
    console.log('✅ Connected to Redis');
});

// Connect immediately
(async () => {
    try {
        await client.connect();
    } catch (err) {
        // Warning already handled by 'error' listener
    }
})();

/**
 * Smart Caching Wrapper
 * @param {string} key - Cache key
 * @param {number} duration - Expiration in seconds
 * @param {Function} fetchFunction - Async function to fetch data if cache miss
 * @returns {Promise<any>} Data from cache or fetchFunction
 */
const getOrSetCache = async (key, duration, fetchFunction) => {
    // If Redis is not open, skip cache and just fetch
    if (!client.isOpen) {
        return await fetchFunction();
    }

    try {
        const cachedData = await client.get(key);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const freshData = await fetchFunction();

        if (freshData) {
            await client.setEx(key, duration, JSON.stringify(freshData));
        }

        return freshData;
    } catch (error) {
        console.error(`Cache error for key ${key}:`, error);
        // Fallback to fresh data on error
        return await fetchFunction();
    }
};

/**
 * Clear keys matching a pattern
 * @param {string} pattern - Key pattern (e.g. 'posts_*')
 */
const clearCachePattern = async (pattern) => {
    if (!client.isOpen) return;

    try {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(keys);
        }
    } catch (error) {
        console.error(`Clear cache error for pattern ${pattern}:`, error);
    }
};

module.exports = {
    client,
    getOrSetCache,
    clearCachePattern
};
