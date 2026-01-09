const { User, syncDatabase } = require('./models');

const seedAdmin = async () => {
    try {
        await syncDatabase({ alter: true }); // Ensure tables exist

        const email = 'admin@luminor.com';
        const password = 'admin123';

        const existingAdmin = await User.findOne({ where: { email } });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            process.exit(0);
        }

        await User.create({
            name: 'Admin User',
            email,
            password,
            role: 'admin',
            avatar: null
        });

        console.log('🎉 Admin user created successfully');
        console.log('📧 Email: admin@luminor.com');
        console.log('🔑 Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
