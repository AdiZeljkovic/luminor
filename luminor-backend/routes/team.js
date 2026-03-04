const express = require('express');
const { TeamMember } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/team — Public: active members
router.get('/', async (req, res) => {
    try {
        const members = await TeamMember.findAll({
            where: { is_active: true },
            order: [['order_num', 'ASC'], ['name', 'ASC']]
        });
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/team/all — Admin
router.get('/all', auth, async (req, res) => {
    try {
        const members = await TeamMember.findAll({ order: [['order_num', 'ASC']] });
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/team — Admin
router.post('/', auth, async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PUT /api/team/:id — Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const member = await TeamMember.findByPk(req.params.id);
        if (!member) return res.status(404).json({ success: false, error: 'Not found' });
        await member.update(req.body);
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// DELETE /api/team/:id — Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const member = await TeamMember.findByPk(req.params.id);
        if (!member) return res.status(404).json({ success: false, error: 'Not found' });
        await member.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
