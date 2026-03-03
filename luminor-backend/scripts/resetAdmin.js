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

        const email = 'adi.zeljkovic@luminor.solutions';
        const password = 'BubaZeljkovic2112!'; // Plain text, model will hash it

        // 1. Delete all existing admin users
        const deleted = await User.destroy({ where: {} });
        if (deleted) {
            console.log(`🗑️  Deleted ${deleted} existing user(s).`);
        }

        // 2. Create new
        const admin = await User.create({
            name: 'Adi Zeljkovic',
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
