const { User, sequelize } = require('./models');

async function checkUser() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const users = await User.findAll();
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkUser();
