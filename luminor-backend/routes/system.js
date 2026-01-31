const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { client } = require('../config/redis');
const { exec } = require('child_process');
const os = require('os');
const { auth } = require('../middleware/auth');

/**
 * @route   GET /api/system/health
 * @desc    Get system health status (DB, Redis, Disk, Memory)
 * @access  Private (Admin only)
 */
router.get('/health', auth, async (req, res) => {
    const health = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        database: { status: 'unknown', latency: 0 },
        redis: { status: 'unknown', latency: 0, hit_rate: 'N/A' },
        system: {
            memoryUsage: process.memoryUsage(),
            osFreeMem: os.freemem(),
            osTotalMem: os.totalmem(),
            platform: os.platform()
        }
    };

    // 1. Check Database
    const startDb = Date.now();
    try {
        await sequelize.authenticate();
        health.database.status = 'connected';
        health.database.latency = Date.now() - startDb;
    } catch (error) {
        health.database.status = 'error';
        health.database.error = error.message;
    }

    // 2. Check Redis
    const startRedis = Date.now();
    try {
        if (client.isOpen) {
            await client.ping();
            health.redis.status = 'connected';
            health.redis.latency = Date.now() - startRedis;

            // Try to get hit/miss stats
            try {
                const info = await client.info();
                // Simple parse for keyspace_hits and keyspace_misses
                const hits = info.match(/keyspace_hits:(\d+)/)?.[1];
                const misses = info.match(/keyspace_misses:(\d+)/)?.[1];

                if (hits && misses) {
                    const total = parseInt(hits) + parseInt(misses);
                    health.redis.hit_rate = total > 0 ? ((parseInt(hits) / total) * 100).toFixed(1) + '%' : '100% (No misses)';
                }
            } catch (e) {
                // Ignore info parsing errors
            }
        } else {
            health.redis.status = 'disconnected';
        }
    } catch (error) {
        health.redis.status = 'error';
        health.redis.error = error.message;
    }

    // 3. Check Disk (Linux/Unix only mostly, simple fallback)
    // We execute 'df -h /' to get disk space of root
    if (os.platform() !== 'win32') {
        exec('df -h /', (error, stdout, stderr) => {
            if (!error) {
                const lines = stdout.trim().split('\n');
                if (lines.length >= 2) {
                    // Filesystem      Size  Used Avail Use% Mounted on
                    // /dev/root        25G   15G  9.8G  60% /
                    const parts = lines[1].split(/\s+/);
                    health.system.disk = {
                        total: parts[1],
                        used: parts[2],
                        free: parts[3],
                        percent: parts[4]
                    };
                }
            }
            res.json({ success: true, data: health });
        });
    } else {
        // Windows or others, skip disk check for now
        res.json({ success: true, data: health });
    }
});

module.exports = router;
