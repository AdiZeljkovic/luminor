const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PricingPlan = sequelize.define('PricingPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(10), defaultValue: 'EUR' },
    billing_cycle: { type: DataTypes.STRING(50), defaultValue: '/ month' },
    description_en: { type: DataTypes.TEXT, allowNull: true },
    description_bs: { type: DataTypes.TEXT, allowNull: true },
    features: { type: DataTypes.JSON, defaultValue: [] },
    is_recommended: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    order_num: { type: DataTypes.INTEGER, defaultValue: 0 },
    category: {
        type: DataTypes.ENUM('web-development', 'seo', 'hosting', 'digital-marketing', 'ai-automation', 'general'),
        defaultValue: 'general'
    },
    cta_text: { type: DataTypes.STRING(100), defaultValue: 'Get Started' },
    cta_url: { type: DataTypes.STRING(255), defaultValue: '/contact' }
}, {
    tableName: 'pricing_plans'
});

module.exports = PricingPlan;
