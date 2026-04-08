const express = require('express');
const { body, validationResult } = require('express-validator');
const { PortfolioProject } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/portfolio
 * @desc    Get all portfolio projects
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const category = req.query.category;
        const featured = req.query.featured;
        const locale = req.query.locale || 'en'; // Default to English

        const offset = (page - 1) * limit;

        // Build where clause
        const where = { status: 'published' };
        if (category) {
            where.category = category;
        }
        if (featured === 'true') {
            where.featured = true;
        }

        const { count, rows: projects } = await PortfolioProject.findAndCountAll({
            where,
            order: [['order_num', 'ASC'], ['completed_at', 'DESC']],
            offset,
            limit
        });

        // Map projects to return localized fields
        const localizedProjects = projects.map(project => {
            const p = project.toJSON();
            return {
                ...p,
                title: p[`title_${locale}`] || p.title_en || p.title_bs,
                description: p[`description_${locale}`] || p.description_en || p.description_bs,
                short_description: p[`short_description_${locale}`] || p.short_description_en || p.short_description_bs,
                challenge: p[`challenge_${locale}`] || p.challenge_en || p.challenge_bs,
                solution: p[`solution_${locale}`] || p.solution_en || p.solution_bs
            };
        });

        res.json({
            success: true,
            data: localizedProjects,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/portfolio/featured
 * @desc    Get featured portfolio projects
 * @access  Public
 */
router.get('/featured', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;

        const projects = await PortfolioProject.findAll({
            where: {
                status: 'published',
                featured: true
            },
            order: [['order_num', 'ASC'], ['completed_at', 'DESC']],
            limit
        });

        res.json({ success: true, data: projects });
    } catch (error) {
        console.error('Get featured projects error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/portfolio/category/:category
 * @desc    Get portfolio projects by category
 * @access  Public
 */
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const limit = parseInt(req.query.limit) || 12;

        const validCategories = ['web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'mobile-development', 'hosting'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ success: false, error: 'Invalid category' });
        }

        const projects = await PortfolioProject.findAll({
            where: {
                category,
                status: 'published'
            },
            order: [['order_num', 'ASC'], ['completed_at', 'DESC']],
            limit
        });

        res.json({ success: true, data: projects });
    } catch (error) {
        console.error('Get projects by category error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/portfolio/:idOrSlug
 * @desc    Get single portfolio project by ID or slug
 * @access  Public
 */
/**
 * @route   GET /api/portfolio/admin/all
 * @desc    Get all portfolio projects including drafts (admin only)
 * @access  Private
 */
router.get('/admin/all', auth, async (req, res) => {
    try {
        const locale = req.query.locale || 'en';
        const { count, rows: projects } = await PortfolioProject.findAndCountAll({
            order: [['created_at', 'DESC']],
        });
        const localizedProjects = projects.map(project => {
            const p = project.toJSON();
            return {
                ...p,
                title: p[`title_${locale}`] || p.title_en || p.title_bs || 'Untitled',
                description: p[`description_${locale}`] || p.description_en || p.description_bs,
                short_description: p[`short_description_${locale}`] || p.short_description_en || p.short_description_bs,
            };
        });
        res.json({ success: true, data: localizedProjects, total: count });
    } catch (error) {
        console.error('Admin get projects error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        const locale = req.query.locale || 'en';
        let project;

        // Check if parameter is a number (ID) or string (slug)
        if (/^\d+$/.test(idOrSlug)) {
            // It's a numeric ID
            project = await PortfolioProject.findByPk(idOrSlug);
        } else {
            // It's a slug
            project = await PortfolioProject.findOne({ where: { slug: idOrSlug } });
        }

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Return localized fields for frontend requests
        const p = project.toJSON();
        const localizedProject = {
            ...p,
            title: p[`title_${locale}`] || p.title_en || p.title_bs,
            description: p[`description_${locale}`] || p.description_en || p.description_bs,
            short_description: p[`short_description_${locale}`] || p.short_description_en || p.short_description_bs,
            challenge: p[`challenge_${locale}`] || p.challenge_en || p.challenge_bs,
            solution: p[`solution_${locale}`] || p.solution_en || p.solution_bs
        };

        res.json({ success: true, data: localizedProject });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/portfolio
 * @desc    Create a new portfolio project
 * @access  Private (Admin)
 */
router.post('/', auth, [
    body('title_en').optional().trim(),
    body('title_bs').optional().trim(),
    body('featuredImage').notEmpty().withMessage('Featured image is required'),
    body('category').isIn(['web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'mobile-development', 'hosting']).withMessage('Valid category is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const {
            title_en, title_bs,
            description_en, description_bs,
            short_description_en, short_description_bs,
            challenge_en, challenge_bs,
            solution_en, solution_bs,
            featuredImage, images, category,
            technologies, client, results, projectUrl, featured, status,
            testimonial, date
        } = req.body;

        // Generate unique slug from English title (or Bosnian if EN not provided)
        const titleForSlug = title_en || title_bs || 'untitled';
        let slug = titleForSlug
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        // Check for existing slug
        const existingProject = await PortfolioProject.findOne({ where: { slug } });
        if (existingProject) {
            slug = `${slug}-${Date.now()}`;
        }

        const project = await PortfolioProject.create({
            title_en,
            title_bs,
            slug,
            description_en,
            description_bs,
            short_description_en,
            short_description_bs,
            featured_image: featuredImage,
            images: images || [],
            category,
            technologies: technologies || [],
            client_name: client,
            results: results || [],
            challenge_en,
            challenge_bs,
            solution_en,
            solution_bs,
            testimonial,
            project_url: projectUrl,
            featured: featured || false,
            status: status || 'draft',
            completed_at: date || null
        });

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/portfolio/:id
 * @desc    Update a portfolio project
 * @access  Private (Admin)
 */
router.put('/:id', auth, [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const project = await PortfolioProject.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        const updates = { ...req.body };

        // Map frontend field names to database field names
        if (updates.date !== undefined) {
            updates.completed_at = updates.date;
            delete updates.date;
        }
        if (updates.featuredImage !== undefined) {
            updates.featured_image = updates.featuredImage;
            delete updates.featuredImage;
        }
        if (updates.shortDescription !== undefined) {
            updates.short_description = updates.shortDescription;
            delete updates.shortDescription;
        }
        if (updates.projectUrl !== undefined) {
            updates.project_url = updates.projectUrl;
            delete updates.projectUrl;
        }
        if (updates.client) {
            updates.client_name = updates.client.name;
            updates.client_industry = updates.client.industry;
            updates.client_website = updates.client.website;
            delete updates.client;
        }

        // If title changed, update slug
        if (updates.title && updates.title !== project.title) {
            updates.slug = updates.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }

        await project.update(updates);

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/portfolio/:id
 * @desc    Delete a portfolio project
 * @access  Private (Admin)
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await PortfolioProject.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        await project.destroy();

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
