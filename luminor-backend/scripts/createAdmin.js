/**
 * Admin User Seed Script
 * Run this once on the server to create the admin user
 * Usage: node scripts/createAdmin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

async function createAdminUser() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synced');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email: 'admin@luminor.solutions' } });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!');
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('LuminorAdmin2026!', 12);

        const admin = await User.create({
            name: 'Luminor Admin',
            email: 'admin@luminor.solutions',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('📋 Login Credentials:');
        console.log('   Email: admin@luminor.solutions');
        console.log('   Password: LuminorAdmin2026!');
        console.log('');
        console.log('⚠️ IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
