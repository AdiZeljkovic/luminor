const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactMessage = sequelize.define('ContactMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    service: {
        type: DataTypes.ENUM('web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'hosting', 'other'),
        defaultValue: 'other'
    },
    status: {
        type: DataTypes.ENUM('new', 'in_progress', 'contacted', 'proposal_sent', 'closed_won', 'closed_lost', 'archived'),
        defaultValue: 'new'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    user_agent: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: 'contact_messages',
    updatedAt: false // Contact messages don't need updated_at
});

module.exports = ContactMessage;
