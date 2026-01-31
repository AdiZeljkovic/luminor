const express = require('express');
const { SiteSettings } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get site settings (Public)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { getOrSetCache } = require('../config/redis');

        // Cache settings for 60 seconds
        const settings = await getOrSetCache('site_settings', 60, async () => {
            const [data, created] = await SiteSettings.findOrCreate({
                where: { id: 1 },
                defaults: {
                    site_title: 'Luminor.Solution',
                    site_description: 'Digital agency providing professional web development and design services.'
                }
            });
            return data;
        });

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/settings
 * @desc    Update site settings (Admin)
 * @access  Private
 */
router.put('/', auth, async (req, res) => {
    try {
        let settings = await SiteSettings.findByPk(1);

        if (!settings) {
            settings = await SiteSettings.create({ id: 1, ...req.body });
        } else {
            await settings.update(req.body);
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
