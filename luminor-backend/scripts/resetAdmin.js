/**
 * Admin User Reset Script
 * Run this to DELETE and RECREATE the admin user
 * Fixes "Double Hashing" bug
 * Usage: node scripts/resetAdmin.js
 */

require('dotenv').config();
const { User } = require('../models');
const sequelize = require('../config/database');

async function resetAdminUser() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        const email = 'admin@luminor.solutions';
        const password = 'LuminorAdmin2026!'; // Plain text, model will hash it

        // 1. Delete existing
        const deleted = await User.destroy({ where: { email } });
        if (deleted) {
            console.log('🗑️  Deleted existing (broken) admin user.');
        }

        // 2. Create new
        // Note: checking User model, it has beforeCreate hook that hashes the password.
        // So we just pass the plain text password here.

        const admin = await User.create({
            name: 'Luminor Admin',
            email: email,
            password: password,
            role: 'admin',
            status: 'active'
        });

        console.log('✅ Admin user recreated successfully!');
        console.log('------------------------------------------------');
        console.log('📧 Email:    ' + email);
        console.log('🔑 Password: ' + password);
        console.log('------------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetAdminUser();
