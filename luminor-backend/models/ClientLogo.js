const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientLogo = sequelize.define('ClientLogo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    logo_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'URL to client logo image'
    },
    website_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Optional link to client website'
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
    tableName: 'client_logos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ClientLogo;
