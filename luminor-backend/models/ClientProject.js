const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientProject = sequelize.define('ClientProject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('planning', 'in_progress', 'review', 'completed', 'on_hold'),
        defaultValue: 'planning'
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    milestones: {
        type: DataTypes.JSON,
        defaultValue: []
        // [{title, status, due_date, completed}]
    },
    files: {
        type: DataTypes.JSON,
        defaultValue: []
        // [{name, url, type, uploaded_at}]
    },
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    }
}, {
    tableName: 'client_projects',
    timestamps: true
});

module.exports = ClientProject;
