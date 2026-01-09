const sequelize = require('../config/database');
const User = require('./User');
const BlogPost = require('./BlogPost');
const PortfolioProject = require('./PortfolioProject');
const ContactMessage = require('./ContactMessage');
const Subscriber = require('./Subscriber');
const Analytics = require('./Analytics');
const SiteSettings = require('./SiteSettings');
const Testimonial = require('./Testimonial');
const ClientLogo = require('./ClientLogo');

// Define associations
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'posts' });
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Sync all models
const syncDatabase = async (options = {}) => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connection established successfully');

        // Sync models (creates tables if they don't exist)
        await sequelize.sync(options);
        console.log('✅ Database synchronized');

        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    BlogPost,
    PortfolioProject,
    ContactMessage,
    Subscriber,
    Analytics,
    SiteSettings,
    Testimonial,
    ClientLogo,
    syncDatabase
};
