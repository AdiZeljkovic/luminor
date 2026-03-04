const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PortfolioProject = sequelize.define('PortfolioProject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Multilingual Title
    title_en: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    title_bs: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING(170),
        allowNull: false,
        unique: true
    },
    // Multilingual Description
    description_en: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    description_bs: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    // Multilingual Short Description
    short_description_en: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    short_description_bs: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    featured_image: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    category: {
        type: DataTypes.ENUM('web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation'),
        allowNull: false
    },
    technologies: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    client_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    client_industry: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    client_website: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    results: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    // Multilingual Challenge
    challenge_en: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    challenge_bs: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    // Multilingual Solution
    solution_en: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    solution_bs: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    testimonial: {
        type: DataTypes.JSON,
        allowNull: true
    },
    project_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    case_study_pdf_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft'
    },
    order_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'portfolio_projects',
    hooks: {
        beforeValidate: (project) => {
            // Generate slug from English title
            if (project.title_en && !project.slug) {
                project.slug = project.title_en
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            }
        }
    }
});

module.exports = PortfolioProject;
