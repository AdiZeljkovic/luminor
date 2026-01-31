const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { BlogPost, User } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/blog
 * @desc    Get all blog posts with pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category;
        const status = req.query.status || 'published';
        const locale = req.query.locale || 'en'; // Default to English

        const offset = (page - 1) * limit;

        // Build where clause
        const where = { status };
        if (category) {
            where.category = category;
        }

        // Generate cache key based on query params
        const cacheKey = `posts_${page}_${limit}_${category || 'all'}_${status}_${locale}`;

        const { getOrSetCache } = require('../config/redis');

        // Cache for 60 seconds
        const result = await getOrSetCache(cacheKey, 60, async () => {
            const { count, rows: posts } = await BlogPost.findAndCountAll({
                where,
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'avatar']
                }],
                order: [['published_at', 'DESC']],
                offset,
                limit
            });

            // Map posts to return localized fields
            const localizedPosts = posts.map(post => {
                const p = post.toJSON();
                return {
                    ...p,
                    title: p[`title_${locale}`] || p.title_en || p.title_bs,
                    content: p[`content_${locale}`] || p.content_en || p.content_bs,
                    excerpt: p[`excerpt_${locale}`] || p.excerpt_en || p.excerpt_bs
                };
            });

            return {
                data: localizedPosts,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit)
                }
            };
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/blog/search
 * @desc    Search blog posts
 * @access  Public
 */
router.get('/search', [
    query('q').trim().notEmpty().withMessage('Search query is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const searchQuery = req.query.q;
        const limit = parseInt(req.query.limit) || 10;

        const posts = await BlogPost.findAll({
            where: {
                status: 'published',
                [Op.or]: [
                    { title: { [Op.like]: `%${searchQuery}%` } },
                    { content: { [Op.like]: `%${searchQuery}%` } }
                ]
            },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            }],
            limit
        });

        res.json({
            success: true,
            data: posts,
            query: searchQuery
        });
    } catch (error) {
        console.error('Search posts error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/blog/recent
 * @desc    Get recent blog posts
 * @access  Public
 */
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const posts = await BlogPost.findAll({
            where: { status: 'published' },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            }],
            order: [['published_at', 'DESC']],
            limit,
            attributes: ['id', 'title', 'slug', 'excerpt', 'featured_image', 'category', 'published_at', 'read_time']
        });

        res.json({ success: true, data: posts });
    } catch (error) {
        console.error('Get recent posts error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/blog/:id
 * @desc    Get single blog post by ID (for Admin)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            }]
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.json({ success: true, data: post });
    } catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/blog/:slug
 * @desc    Get single blog post by slug
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({
            where: { slug: req.params.slug },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            }]
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // Increment views
        await post.increment('views');

        res.json({ success: true, data: post });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/blog
 * @desc    Create a new blog post
 * @access  Private (Admin)
 */
router.post('/', auth, [
    body('title_en').optional().trim(),
    body('title_bs').optional().trim(),
    body('content_en').optional(),
    body('content_bs').optional(),
    body('category').optional().isIn(['web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'news', 'tutorials'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const {
            title_en, title_bs,
            content_en, content_bs,
            excerpt_en, excerpt_bs,
            featuredImage, category, tags, status
        } = req.body;

        // Generate unique slug from English title (or Bosnian if EN not provided)
        const titleForSlug = title_en || title_bs || 'untitled';
        let slug = titleForSlug
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        // Check for existing slug and make unique if needed
        const existingPost = await BlogPost.findOne({ where: { slug } });
        if (existingPost) {
            slug = `${slug}-${Date.now()}`;
        }

        const post = await BlogPost.create({
            title_en,
            title_bs,
            slug,
            content_en,
            content_bs,
            excerpt_en,
            excerpt_bs,
            featured_image: featuredImage,
            category,
            tags: tags || [],
            status,
            author_id: req.user.id
        });

        // Reload with author
        const postWithAuthor = await BlogPost.findByPk(post.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            }]
        });

        res.status(201).json({ success: true, data: postWithAuthor });

        // Clear cache
        const { clearCachePattern } = require('../config/redis');
        await clearCachePattern('posts_*');
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/blog/:id
 * @desc    Update a blog post
 * @access  Private (Admin)
 */
router.put('/:id', auth, [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const post = await BlogPost.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const updates = { ...req.body };

        // Map frontend field names to database field names
        if (updates.featuredImage !== undefined) {
            updates.featured_image = updates.featuredImage;
            delete updates.featuredImage;
        }

        // If title changed, update slug
        if (updates.title && updates.title !== post.title) {
            updates.slug = updates.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }

        await post.update(updates);

        // Reload with author
        const updatedPost = await BlogPost.findByPk(post.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            }]
        });

        res.json({ success: true, data: updatedPost });

        // Clear cache
        const { clearCachePattern } = require('../config/redis');
        await clearCachePattern('posts_*');
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/blog/:id
 * @desc    Delete a blog post
 * @access  Private (Admin)
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await BlogPost.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        await post.destroy();

        res.json({ success: true, message: 'Post deleted successfully' });

        // Clear cache
        const { clearCachePattern } = require('../config/redis');
        await clearCachePattern('posts_*');
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
