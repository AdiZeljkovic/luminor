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
const FAQ = require('./FAQ');
const StatusService = require('./StatusService');
const ChatSession = require('./ChatSession');
const ChatMessage = require('./ChatMessage');
const Client = require('./Client');
const ClientProject = require('./ClientProject');
const HostingPlan = require('./HostingPlan');
const Invoice = require('./Invoice');
const PricingPlan = require('./PricingPlan');
const TeamMember = require('./TeamMember');

// Define associations
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'posts' });
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

ChatSession.hasMany(ChatMessage, { foreignKey: 'session_id', as: 'messages' });
ChatMessage.belongsTo(ChatSession, { foreignKey: 'session_id', as: 'session' });

Client.hasMany(ClientProject, { foreignKey: 'client_id', as: 'projects' });
ClientProject.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Client.hasMany(HostingPlan, { foreignKey: 'client_id', as: 'hostingPlans' });
HostingPlan.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Client.hasMany(Invoice, { foreignKey: 'client_id', as: 'invoices' });
Invoice.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

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
    FAQ,
    StatusService,
    ChatSession,
    ChatMessage,
    Client,
    ClientProject,
    HostingPlan,
    Invoice,
    PricingPlan,
    TeamMember,
    syncDatabase
};
