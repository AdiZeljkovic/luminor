const express = require('express');
const { PricingPlan } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/pricing — Public: active plans, optionally filtered by category
router.get('/', async (req, res) => {
    try {
        const where = { is_active: true };
        if (req.query.category) where.category = req.query.category;
        const plans = await PricingPlan.findAll({ where, order: [['order_num', 'ASC'], ['price', 'ASC']] });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/pricing/all — Admin: all plans
router.get('/all', auth, async (req, res) => {
    try {
        const plans = await PricingPlan.findAll({ order: [['category', 'ASC'], ['order_num', 'ASC']] });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/pricing — Admin
router.post('/', auth, async (req, res) => {
    try {
        const { name, price, currency, billing_cycle, description_en, description_bs, features, is_recommended, is_active, order_num, category, cta_text, cta_url } = req.body;
        const plan = await PricingPlan.create({ name, price, currency, billing_cycle, description_en, description_bs, features, is_recommended, is_active, order_num, category, cta_text, cta_url });
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PUT /api/pricing/:id — Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const plan = await PricingPlan.findByPk(req.params.id);
        if (!plan) return res.status(404).json({ success: false, error: 'Not found' });
        const { name, price, currency, billing_cycle, description_en, description_bs, features, is_recommended, is_active, order_num, category, cta_text, cta_url } = req.body;
        await plan.update({ name, price, currency, billing_cycle, description_en, description_bs, features, is_recommended, is_active, order_num, category, cta_text, cta_url });
        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// DELETE /api/pricing/:id — Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const plan = await PricingPlan.findByPk(req.params.id);
        if (!plan) return res.status(404).json({ success: false, error: 'Not found' });
        await plan.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
