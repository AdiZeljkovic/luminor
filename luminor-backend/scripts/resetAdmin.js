/**
 * Admin User Reset Script
 * Deletes all existing admin users and creates a new one.
 *
 * Usage:
 *   node scripts/resetAdmin.js <email> <password> [name]
 *
 * Example:
 *   node scripts/resetAdmin.js adi@luminor.solutions MyPassword123! "Adi Zeljkovic"
 *
 * Credentials are passed as arguments - never stored in code or git.
 */

require('dotenv').config();
const { User } = require('../models');
const sequelize = require('../config/database');

async function resetAdminUser() {
    const [,, email, password, name = 'Admin'] = process.argv;

    if (!email || !password) {
        console.error('❌ Usage: node scripts/resetAdmin.js <email> <password> [name]');
        console.error('   Example: node scripts/resetAdmin.js admin@example.com MyPass123! "John Doe"');
        process.exit(1);
    }

    if (password.length < 8) {
        console.error('❌ Password must be at least 8 characters.');
        process.exit(1);
    }

    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // 1. Delete all existing users
        const deleted = await User.destroy({ where: {} });
        if (deleted) {
            console.log(`🗑️  Deleted ${deleted} existing user(s).`);
        }

        // 2. Create new admin (model's beforeCreate hook hashes the password)
        await User.create({
            name,
            email,
            password,
            role: 'admin',
            status: 'active'
        });

        console.log('✅ Admin user created successfully!');
        console.log('------------------------------------------------');
        console.log('📧 Email: ' + email);
        console.log('👤 Name:  ' + name);
        console.log('------------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message || error);
        process.exit(1);
    }
}

resetAdminUser();
