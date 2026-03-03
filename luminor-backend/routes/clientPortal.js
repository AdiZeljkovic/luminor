const express = require('express');
const { Client, ClientProject, HostingPlan, Invoice } = require('../models');
const { clientAuth } = require('./clientAuth');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ==================
// CLIENT-FACING ROUTES (require client auth)
// ==================

/**
 * @route   GET /api/portal/projects
 * @access  Client
 */
router.get('/projects', clientAuth, async (req, res) => {
    try {
        const projects = await ClientProject.findAll({
            where: { client_id: req.client.id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/portal/hosting
 * @access  Client
 */
router.get('/hosting', clientAuth, async (req, res) => {
    try {
        const plans = await HostingPlan.findAll({
            where: { client_id: req.client.id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/portal/invoices
 * @access  Client
 */
router.get('/invoices', clientAuth, async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            where: { client_id: req.client.id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/portal/dashboard
 * @access  Client
 */
router.get('/dashboard', clientAuth, async (req, res) => {
    try {
        const [projects, hosting, invoices] = await Promise.all([
            ClientProject.findAll({ where: { client_id: req.client.id }, attributes: ['id', 'title', 'status', 'progress', 'end_date'] }),
            HostingPlan.findAll({ where: { client_id: req.client.id }, attributes: ['id', 'domain', 'plan_name', 'status', 'expires_at'] }),
            Invoice.findAll({ where: { client_id: req.client.id }, attributes: ['id', 'invoice_number', 'amount', 'currency', 'status', 'due_date'] })
        ]);

        res.json({
            success: true,
            data: {
                projects,
                hosting,
                invoices,
                summary: {
                    activeProjects: projects.filter(p => p.status === 'in_progress').length,
                    pendingInvoices: invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length,
                    activeHosting: hosting.filter(h => h.status === 'active').length
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ==================
// ADMIN ROUTES (require admin auth)
// ==================

/**
 * @route   GET /api/portal/admin/clients
 * @access  Admin
 */
router.get('/admin/clients', auth, async (req, res) => {
    try {
        const clients = await Client.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: clients });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/portal/admin/clients
 * @access  Admin
 */
router.post('/admin/clients', auth, [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { name, email, password, company, phone, notes } = req.body;

        const existing = await Client.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const client = await Client.create({ name, email, password: hashedPassword, company, phone, notes });

        const { password: _, ...clientData } = client.toJSON();
        res.status(201).json({ success: true, data: clientData });
    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/portal/admin/clients/:id
 * @access  Admin
 */
router.put('/admin/clients/:id', auth, async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ success: false, error: 'Client not found' });

        const { name, company, phone, notes, is_active, password } = req.body;
        const updates = { name, company, phone, notes, is_active };

        if (password && password.length >= 8) {
            updates.password = await bcrypt.hash(password, 12);
        }

        await client.update(updates);
        const { password: _, ...clientData } = client.toJSON();
        res.json({ success: true, data: clientData });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/portal/admin/clients/:id
 * @access  Admin
 */
router.delete('/admin/clients/:id', auth, async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
        await client.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// --- Client Projects (Admin) ---

router.get('/admin/clients/:clientId/projects', auth, async (req, res) => {
    try {
        const projects = await ClientProject.findAll({
            where: { client_id: req.params.clientId },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.post('/admin/projects', auth, async (req, res) => {
    try {
        const project = await ClientProject.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.put('/admin/projects/:id', auth, async (req, res) => {
    try {
        const project = await ClientProject.findByPk(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Not found' });
        await project.update(req.body);
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.delete('/admin/projects/:id', auth, async (req, res) => {
    try {
        const project = await ClientProject.findByPk(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Not found' });
        await project.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// --- Hosting Plans (Admin) ---

router.get('/admin/clients/:clientId/hosting', auth, async (req, res) => {
    try {
        const plans = await HostingPlan.findAll({ where: { client_id: req.params.clientId } });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.post('/admin/hosting', auth, async (req, res) => {
    try {
        const plan = await HostingPlan.create(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.put('/admin/hosting/:id', auth, async (req, res) => {
    try {
        const plan = await HostingPlan.findByPk(req.params.id);
        if (!plan) return res.status(404).json({ success: false, error: 'Not found' });
        await plan.update(req.body);
        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.delete('/admin/hosting/:id', auth, async (req, res) => {
    try {
        const plan = await HostingPlan.findByPk(req.params.id);
        if (!plan) return res.status(404).json({ success: false, error: 'Not found' });
        await plan.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// --- Invoices (Admin) ---

router.get('/admin/clients/:clientId/invoices', auth, async (req, res) => {
    try {
        const invoices = await Invoice.findAll({ where: { client_id: req.params.clientId }, order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.post('/admin/invoices', auth, async (req, res) => {
    try {
        // Auto-generate invoice number
        const count = await Invoice.count();
        const invoice_number = req.body.invoice_number || `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        const invoice = await Invoice.create({ ...req.body, invoice_number });
        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.put('/admin/invoices/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
        if (req.body.status === 'paid' && !invoice.paid_at) {
            req.body.paid_at = new Date();
        }
        await invoice.update(req.body);
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.delete('/admin/invoices/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
        await invoice.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
