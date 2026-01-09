const express = require('express');
const { Analytics } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

/**
 * @route   POST /api/analytics/track
 * @desc    Track page view (Internal/Public)
 * @access  Public
 */
router.post('/track', async (req, res) => {
    try {
        const { page } = req.body;
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Simple upsert logic
        const [record, created] = await Analytics.findOrCreate({
            where: { page, date },
            defaults: { views: 1, unique_visitors: 1 }
        });

        if (!created) {
            await record.increment('views');
            // Logic for unique visitors would require IP tracking/fingerprinting, 
            // for now we'll just approximate 1 unique = 1 view or rely on client flag
            // A simple approximation: increment unique every 5th view or random
            // Better: client sends "isNewSession" flag
            if (req.body.isUnique) {
                await record.increment('unique_visitors');
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Analytics track error:', error);
        res.status(500).json({ success: false });
    }
});

/**
 * @route   GET /api/analytics/stats
 * @desc    Get dashboard stats (Admin)
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
    try {
        // 1. Total Entitites Counts
        const { BlogPost, PortfolioProject, ContactMessage, Subscriber } = require('../models');

        const totalPosts = await BlogPost.count();
        const totalProjects = await PortfolioProject.count();
        const totalMessages = await ContactMessage.count();
        const newMessages = await ContactMessage.count({ where: { status: 'new' } });
        const subscribers = await Subscriber.count();

        // 2. Traffic Stats (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trafficData = await Analytics.findAll({
            where: {
                date: { [Op.gte]: thirtyDaysAgo }
            },
            attributes: [
                'date',
                [sequelize.fn('sum', sequelize.col('views')), 'total_views'],
                [sequelize.fn('sum', sequelize.col('unique_visitors')), 'total_unique']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });

        // 3. Recent Data (Last 5)
        const recentMessages = await ContactMessage.findAll({
            limit: 5,
            order: [['created_at', 'DESC']]
        });

        const recentSubscribers = await Subscriber.findAll({
            limit: 5,
            order: [['created_at', 'DESC']]
        });

        // 3. Total Visits (all time)
        const totalVisits = await Analytics.sum('views');

        res.json({
            success: true,
            counts: {
                posts: totalPosts,
                projects: totalProjects,
                messages: totalMessages,
                newMessages,
                subscribers,
                visits: totalVisits || 0
            },
            traffic: trafficData,
            recents: {
                messages: recentMessages,
                subscribers: recentSubscribers
            },
            topPages: await Analytics.findAll({
                attributes: [
                    'page',
                    [sequelize.fn('sum', sequelize.col('views')), 'total_views'],
                    [sequelize.fn('sum', sequelize.col('unique_visitors')), 'total_unique']
                ],
                group: ['page'],
                order: [[sequelize.col('total_views'), 'DESC']],
                limit: 10
            })
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

const sequelize = require('../config/database'); // Needed for Op/fn in route
module.exports = router;
