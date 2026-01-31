const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteSettings = sequelize.define('SiteSettings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // General
    site_title: {
        type: DataTypes.STRING,
        defaultValue: 'Luminor.Solution'
    },
    site_description: {
        type: DataTypes.TEXT,
        defaultValue: 'Digital agency providing professional web development and design services.'
    },
    site_keywords: {
        type: DataTypes.TEXT, // Comma separated
        defaultValue: 'web development, design, marketing'
    },

    // Contact Info (for Footer/Contact page)
    contact_email: {
        type: DataTypes.STRING,
        defaultValue: 'info@luminor.solution'
    },
    contact_phone: {
        type: DataTypes.STRING,
        defaultValue: '+387 60 000 0000'
    },
    contact_address: {
        type: DataTypes.STRING,
        defaultValue: 'Sarajevo, Bosnia and Herzegovina'
    },

    // Social Links
    social_facebook: DataTypes.STRING,
    social_instagram: DataTypes.STRING,
    social_linkedin: DataTypes.STRING,
    social_twitter: DataTypes.STRING,

    // Integrations
    google_analytics_id: DataTypes.STRING,
    google_tag_manager_id: DataTypes.STRING,
    facebook_pixel_id: DataTypes.STRING,

    // Webmaster Verification
    google_site_verification: DataTypes.STRING,
    bing_site_verification: DataTypes.STRING,
    yandex_verification: DataTypes.STRING,
    baidu_verification: DataTypes.STRING,

    // Advanced SEO
    og_image_url: DataTypes.STRING, // Default social share image
    robots_txt: {
        type: DataTypes.TEXT,
        defaultValue: "User-agent: *\nAllow: /"
    },

    // Structured Data (Organization/LocalBusiness)
    schema_type: {
        type: DataTypes.STRING,
        defaultValue: 'Organization' // or 'LocalBusiness', 'Corporation'
    },
    business_name: DataTypes.STRING, // Alternative name for schema
    logo_url: DataTypes.STRING,
    price_range: DataTypes.STRING, // e.g. "$$-$$$"
    opening_hours: DataTypes.STRING, // e.g. "Mo-Fr 09:00-17:00"
    geo_latitude: DataTypes.STRING,
    geo_longitude: DataTypes.STRING,

    schema_params: {
        type: DataTypes.JSON,
        defaultValue: {}
    },

    // System Status
    maintenance_mode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Announcement Banner
    announcement_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    announcement_message: DataTypes.STRING,
    announcement_link: DataTypes.STRING

}, {
    tableName: 'site_settings',
    timestamps: true
});

module.exports = SiteSettings;
