const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Multilingual Title
    title_en: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    title_bs: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true
    },
    // Multilingual Content
    content_en: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    content_bs: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    // Multilingual Excerpt
    excerpt_en: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    excerpt_bs: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    featured_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM('web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'news', 'tutorials'),
        defaultValue: 'news'
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft'
    },
    read_time: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'blog_posts',
    hooks: {
        beforeValidate: (post) => {
            // Generate slug from English title
            if (post.title_en && !post.slug) {
                post.slug = post.title_en
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            }
        },
        beforeSave: (post) => {
            // Calculate read time from English content (or Bosnian if EN not present)
            const content = post.content_en || post.content_bs;
            if (content) {
                const wordsPerMinute = 200;
                const wordCount = content.split(/\s+/).length;
                post.read_time = Math.ceil(wordCount / wordsPerMinute);
            }
            // Set published_at when publishing
            if (post.status === 'published' && !post.published_at) {
                post.published_at = new Date();
            }
        }
    }
});

module.exports = BlogPost;
