const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HostingPlan = sequelize.define('HostingPlan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    domain: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    plan_name: {
        type: DataTypes.STRING(100),
        defaultValue: 'Basic'
    },
    storage_gb: {
        type: DataTypes.FLOAT,
        defaultValue: 5
    },
    bandwidth_gb: {
        type: DataTypes.FLOAT,
        defaultValue: 50
    },
    expires_at: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'suspended', 'expired', 'pending'),
        defaultValue: 'active'
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    nameservers: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    features: {
        type: DataTypes.JSON,
        defaultValue: []
        // ['SSL Certificate', 'Daily Backups', '24/7 Support']
    },
    monthly_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'hosting_plans',
    timestamps: true
});

module.exports = HostingPlan;
