const express = require('express');
const router = express.Router();
const { Testimonial } = require('../models');
const { auth: authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/testimonials
 * @desc    Get all active testimonials (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            where: { is_active: true },
            order: [['display_order', 'ASC'], ['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   GET /api/testimonials/featured
 * @desc    Get featured testimonials for homepage
 * @access  Public
 */
router.get('/featured', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            where: { is_active: true, is_featured: true },
            order: [['display_order', 'ASC']],
            limit: 6
        });

        res.json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        console.error('Error fetching featured testimonials:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   GET /api/testimonials/all
 * @desc    Get all testimonials (Admin)
 * @access  Private
 */
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 500);
        const offset = parseInt(req.query.offset) || 0;
        const testimonials = await Testimonial.findAll({
            order: [['display_order', 'ASC'], ['created_at', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        console.error('Error fetching all testimonials:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get single testimonial
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        res.json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { client_name, client_position, company_name, content, rating, avatar_url, is_featured, is_active, display_order } = req.body;

        if (!client_name || !company_name || !content) {
            return res.status(400).json({ success: false, message: 'Client name, company name, and content are required' });
        }

        const testimonial = await Testimonial.create({
            client_name,
            client_position,
            company_name,
            content,
            rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
            avatar_url,
            is_featured: is_featured || false,
            is_active: is_active !== false,
            display_order: display_order || 0
        });

        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            data: testimonial
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update a testimonial
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        const { client_name, client_position, company_name, content, rating, avatar_url, is_featured, is_active, display_order } = req.body;

        await testimonial.update({
            client_name: client_name || testimonial.client_name,
            client_position: client_position !== undefined ? client_position : testimonial.client_position,
            company_name: company_name || testimonial.company_name,
            content: content || testimonial.content,
            rating: rating !== undefined ? rating : testimonial.rating,
            avatar_url: avatar_url !== undefined ? avatar_url : testimonial.avatar_url,
            is_featured: is_featured !== undefined ? is_featured : testimonial.is_featured,
            is_active: is_active !== undefined ? is_active : testimonial.is_active,
            display_order: display_order !== undefined ? display_order : testimonial.display_order
        });

        res.json({
            success: true,
            message: 'Testimonial updated successfully',
            data: testimonial
        });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete a testimonial
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        await testimonial.destroy();

        res.json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
