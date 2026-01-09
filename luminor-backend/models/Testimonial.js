const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    client_position: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Job title or position'
    },
    company_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'The testimonial text'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: {
            min: 1,
            max: 5
        }
    },
    avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL to client avatar/photo'
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Featured testimonials appear on homepage'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Order for display (lower = first)'
    }
}, {
    tableName: 'testimonials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Testimonial;
