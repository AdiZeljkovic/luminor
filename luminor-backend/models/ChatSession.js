const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatSession = sequelize.define('ChatSession', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    visitor_name: {
        type: DataTypes.STRING(100),
        defaultValue: 'Visitor'
    },
    visitor_email: {
        type: DataTypes.STRING(254),
        allowNull: true
    },
    page_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    socket_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'closed', 'waiting'),
        defaultValue: 'waiting'
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    unread_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'chat_sessions',
    timestamps: true
});

module.exports = ChatSession;
