const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Analytics = sequelize.define('Analytics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    page: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    unique_visitors: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'analytics',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['page', 'date']
        }
    ]
});

module.exports = Analytics;
