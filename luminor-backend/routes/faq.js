const express = require('express');
const { body, validationResult } = require('express-validator');
const { FAQ } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /api/faq
 * @desc    Get all active FAQs (Public)
 */
router.get('/', async (req, res) => {
    try {
        const category = req.query.category;
        const locale = req.query.locale || 'en';

        const where = { is_active: true };
        if (category) where.category = category;

        const faqs = await FAQ.findAll({
            where,
            order: [['category', 'ASC'], ['order_num', 'ASC'], ['created_at', 'ASC']]
        });

        const localizedFaqs = faqs.map(faq => {
            const f = faq.toJSON();
            return {
                ...f,
                question: f[`question_${locale}`] || f.question_en || f.question_bs,
                answer: f[`answer_${locale}`] || f.answer_en || f.answer_bs
            };
        });

        res.json({ success: true, data: localizedFaqs });
    } catch (error) {
        console.error('Get FAQs error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/faq/all
 * @desc    Get all FAQs (Admin)
 */
router.get('/all', auth, async (req, res) => {
    try {
        const faqs = await FAQ.findAll({
            order: [['category', 'ASC'], ['order_num', 'ASC']]
        });
        res.json({ success: true, data: faqs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/faq/:id
 * @desc    Get single FAQ (Admin)
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
        res.json({ success: true, data: faq });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/faq
 * @desc    Create FAQ (Admin)
 */
router.post('/', auth, [
    body('category').optional().isIn(['general', 'web-development', 'seo', 'hosting', 'pricing', 'process'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { question_en, question_bs, answer_en, answer_bs, category, order_num, is_active } = req.body;

        if (!question_en && !question_bs) {
            return res.status(400).json({ success: false, error: 'At least one question is required' });
        }

        const faq = await FAQ.create({ question_en, question_bs, answer_en, answer_bs, category, order_num, is_active });
        res.status(201).json({ success: true, data: faq });
    } catch (error) {
        console.error('Create FAQ error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/faq/:id
 * @desc    Update FAQ (Admin)
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });

        await faq.update(req.body);
        res.json({ success: true, data: faq });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/faq/:id
 * @desc    Delete FAQ (Admin)
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
        await faq.destroy();
        res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
