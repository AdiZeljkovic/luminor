const sequelize = require('../config/database');
const SiteSettings = require('../models/SiteSettings');

async function seedSettings() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync(); // Ensure tables exist

        const defaultSettings = {
            site_title: "Luminor Solution Agency | Web development & digital marketing specialists",
            site_description: "Full-service digital agency. We build custom websites, impactful brands, and data-driven marketing campaigns that grow your business.",
            site_keywords: "luminor solution, luminor solution agency, web development, digital marketing, graphic design, seo agency, sarajevo, balkan, software company, custom software",

            contact_email: "info@luminor.solution",
            contact_phone: "+387 60 123 4567",
            contact_address: "Sarajevo, Bosnia & Herzegovina",

            social_facebook: "https://facebook.com/luminor.solution",
            social_instagram: "https://instagram.com/luminor.solution",
            social_linkedin: "https://linkedin.com/company/luminor-solution",

            google_site_verification: "verification_code_placeholder",

            schema_type: "Organization",
            business_name: "Luminor Solution",
            price_range: "$$$",
            opening_hours: "Mo-Fr 09:00-17:00",
            geo_latitude: "43.8563",
            geo_longitude: "18.4131"
        };

        const [settings, created] = await SiteSettings.findOrCreate({
            where: { id: 1 },
            defaults: defaultSettings
        });

        if (!created) {
            await settings.update(defaultSettings);
            console.log('Settings updated.');
        } else {
            console.log('Settings created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedSettings();
