const express = require('express');
const { body, validationResult } = require('express-validator');
const { Subscriber } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post('/subscribe', [
    body('email').isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body;

        // Check if already subscribed
        let subscriber = await Subscriber.findOne({ where: { email } });

        if (subscriber) {
            if (subscriber.status === 'unsubscribed') {
                subscriber.status = 'active';
                await subscriber.save();
                return res.json({ success: true, message: 'Welcome back! You have successfully resubscribed.' });
            }
            return res.status(400).json({ success: false, error: 'Email is already subscribed' });
        }

        subscriber = await Subscriber.create({ email });

        res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/newsletter
 * @desc    Get all subscribers (Admin only)
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const subscribers = await Subscriber.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json({ success: true, data: subscribers });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/newsletter/:id
 * @desc    Delete subscriber (Admin only)
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const subscriber = await Subscriber.findByPk(req.params.id);
        if (!subscriber) {
            return res.status(404).json({ success: false, error: 'Subscriber not found' });
        }

        await subscriber.destroy();
        res.json({ success: true, message: 'Subscriber removed' });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
