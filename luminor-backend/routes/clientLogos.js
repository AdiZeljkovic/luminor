const express = require('express');
const router = express.Router();
const { ClientLogo } = require('../models');
const { auth: authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/client-logos
 * @desc    Get all active client logos (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const logos = await ClientLogo.findAll({
            where: { is_active: true },
            order: [['display_order', 'ASC'], ['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: logos
        });
    } catch (error) {
        console.error('Error fetching client logos:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   GET /api/client-logos/all
 * @desc    Get all client logos (Admin)
 * @access  Private
 */
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const logos = await ClientLogo.findAll({
            order: [['display_order', 'ASC'], ['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: logos
        });
    } catch (error) {
        console.error('Error fetching all client logos:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   GET /api/client-logos/:id
 * @desc    Get single client logo
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const logo = await ClientLogo.findByPk(req.params.id);

        if (!logo) {
            return res.status(404).json({ success: false, message: 'Client logo not found' });
        }

        res.json({
            success: true,
            data: logo
        });
    } catch (error) {
        console.error('Error fetching client logo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   POST /api/client-logos
 * @desc    Create a new client logo
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { client_name, logo_url, website_url, is_active, display_order } = req.body;

        if (!client_name || !logo_url) {
            return res.status(400).json({ success: false, message: 'Client name and logo URL are required' });
        }

        const logo = await ClientLogo.create({
            client_name,
            logo_url,
            website_url,
            is_active: is_active !== false,
            display_order: display_order || 0
        });

        res.status(201).json({
            success: true,
            message: 'Client logo created successfully',
            data: logo
        });
    } catch (error) {
        console.error('Error creating client logo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   PUT /api/client-logos/:id
 * @desc    Update a client logo
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const logo = await ClientLogo.findByPk(req.params.id);

        if (!logo) {
            return res.status(404).json({ success: false, message: 'Client logo not found' });
        }

        const { client_name, logo_url, website_url, is_active, display_order } = req.body;

        await logo.update({
            client_name: client_name || logo.client_name,
            logo_url: logo_url || logo.logo_url,
            website_url: website_url !== undefined ? website_url : logo.website_url,
            is_active: is_active !== undefined ? is_active : logo.is_active,
            display_order: display_order !== undefined ? display_order : logo.display_order
        });

        res.json({
            success: true,
            message: 'Client logo updated successfully',
            data: logo
        });
    } catch (error) {
        console.error('Error updating client logo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/client-logos/:id
 * @desc    Delete a client logo
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const logo = await ClientLogo.findByPk(req.params.id);

        if (!logo) {
            return res.status(404).json({ success: false, message: 'Client logo not found' });
        }

        await logo.destroy();

        res.json({
            success: true,
            message: 'Client logo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting client logo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
