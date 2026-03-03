const express = require('express');
const { StatusService } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /api/status
 * @desc    Get all service statuses (Public)
 */
router.get('/', async (req, res) => {
    try {
        const services = await StatusService.findAll({
            order: [['order_num', 'ASC'], ['name', 'ASC']]
        });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/status/:id
 * @desc    Update service status (Admin)
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const service = await StatusService.findByPk(req.params.id);
        if (!service) return res.status(404).json({ success: false, error: 'Service not found' });

        const { status, description } = req.body;
        const validStatuses = ['operational', 'degraded', 'outage', 'maintenance'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        await service.update({ ...(status && { status }), ...(description !== undefined && { description }) });
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/status
 * @desc    Create service (Admin)
 */
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, status, category, order_num } = req.body;
        if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
        const service = await StatusService.create({ name, description, status, category, order_num });
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/status/:id
 * @desc    Delete service (Admin)
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const service = await StatusService.findByPk(req.params.id);
        if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
        await service.destroy();
        res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
