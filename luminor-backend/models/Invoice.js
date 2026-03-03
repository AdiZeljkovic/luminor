const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'EUR'
    },
    status: {
        type: DataTypes.ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled'),
        defaultValue: 'pending'
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    items: {
        type: DataTypes.JSON,
        defaultValue: []
        // [{description, quantity, unit_price, total}]
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'invoices',
    timestamps: true
});

module.exports = Invoice;
