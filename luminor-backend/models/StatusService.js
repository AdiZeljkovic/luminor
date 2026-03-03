const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StatusService = sequelize.define('StatusService', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('operational', 'degraded', 'outage', 'maintenance'),
        defaultValue: 'operational'
    },
    category: {
        type: DataTypes.STRING(50),
        defaultValue: 'general'
    },
    order_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'status_services'
});

module.exports = StatusService;
