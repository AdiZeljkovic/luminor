const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FAQ = sequelize.define('FAQ', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_en: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    question_bs: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    answer_en: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    answer_bs: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM('general', 'web-development', 'seo', 'hosting', 'pricing', 'process'),
        defaultValue: 'general'
    },
    order_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'faqs',
    indexes: [
        { fields: ['category'] },
        { fields: ['order_num'] },
        { fields: ['is_active'] }
    ]
});

module.exports = FAQ;
