const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeamMember = sequelize.define('TeamMember', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    role_en: { type: DataTypes.STRING(100), allowNull: true },
    role_bs: { type: DataTypes.STRING(100), allowNull: true },
    bio_en: { type: DataTypes.TEXT, allowNull: true },
    bio_bs: { type: DataTypes.TEXT, allowNull: true },
    photo_url: { type: DataTypes.STRING(500), allowNull: true },
    linkedin_url: { type: DataTypes.STRING(255), allowNull: true },
    order_num: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'team_members'
});

module.exports = TeamMember;
