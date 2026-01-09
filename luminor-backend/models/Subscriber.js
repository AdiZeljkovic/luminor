const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscriber = sequelize.define('Subscriber', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'unsubscribed'),
        defaultValue: 'active'
    },
    source: {
        type: DataTypes.STRING(50),
        defaultValue: 'website'
    }
}, {
    tableName: 'subscribers',
    updatedAt: false
});

module.exports = Subscriber;
