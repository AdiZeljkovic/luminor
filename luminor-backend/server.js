require('dotenv').config();

// SECURITY: Validate environment variables before starting
const { validateEnv } = require('./config/envValidator');
validateEnv();

const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Import database
const { syncDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/uploadRoutes');
const testimonialsRoutes = require('./routes/testimonials');

const clientLogosRoutes = require('./routes/clientLogos');
const systemRoutes = require('./routes/system');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const corsConfig = require('./middleware/corsConfig');
const { errorLogger, requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// SECURITY MIDDLEWARE
// ----------------------------

// Trust Proxy (Required for Nginx/HestiaCP)
// This ensures req.ip represents the real client IP, not 127.0.0.1
// and allows Rate Limiting to work correctly per user.
app.set('trust proxy', 1);

// Helmet: Sets various HTTP headers for security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://www.google-analytics.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding images from CDNs
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow serving images
}));

// Compression: Gzip responses for better performance
app.use(compression({
    level: 6, // Balanced compression
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// CORS
app.use(corsConfig);

// Cookie Parser (needed for httpOnly cookies)
app.use(cookieParser());

// Body parsers with size limits
app.use(express.json({ limit: '1mb' })); // Reduced from 10mb for security
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging (optional - enable via LOG_REQUESTS=true)
app.use(requestLogger);

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ----------------------------
// RATE LIMITING
// ----------------------------

// Strict rate limiting for auth routes (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false } // Trust proxy is handled by app.set
});

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window (increased for legitimate use)
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false } // Trust proxy is handled by app.set
});

app.use('/api/auth', authLimiter);
app.use('/api/', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/client-logos', clientLogosRoutes);
app.use('/api/system', systemRoutes);

// Enhanced Health check endpoint
app.get('/api/health', async (req, res) => {
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        checks: {
            database: 'checking',
            redis: 'checking'
        }
    };

    try {
        // Check database connection
        const sequelize = require('./config/database');
        await sequelize.authenticate();
        health.checks.database = 'healthy';
    } catch (error) {
        health.checks.database = 'unhealthy';
        health.status = 'DEGRADED';
    }

    try {
        // Check Redis connection (if used)
        const { redisClient } = require('./config/redis');
        if (redisClient && redisClient.isReady) {
            await redisClient.ping();
            health.checks.redis = 'healthy';
        } else {
            health.checks.redis = 'not connected';
        }
    } catch (error) {
        health.checks.redis = 'unhealthy';
    }

    res.status(health.status === 'OK' ? 200 : 503).json(health);
});

// Error handling middleware
app.use(errorLogger); // Log errors to file
app.use(errorHandler); // Send error response

// Start server
let server;
const startServer = async () => {
    try {
        // Sync database (creates tables if they don't exist)
        // ENABLE ALTER to update schema with new fields
        await syncDatabase({ alter: true });

        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`⏰ Startup Time: ${new Date().toISOString()}`);
            console.log(`📍 API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful Shutdown Handler
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    if (server) {
        server.close(async () => {
            console.log('HTTP server closed');

            try {
                // Close database connection
                const sequelize = require('./config/database');
                await sequelize.close();
                console.log('Database connection closed');

                // Close Redis connection
                const { redisClient } = require('./config/redis');
                if (redisClient && redisClient.isOpen) {
                    await redisClient.quit();
                    console.log('Redis connection closed');
                }

                console.log('Graceful shutdown completed');
                process.exit(0);
            } catch (error) {
                console.error('Error during shutdown:', error);
                process.exit(1);
            }
        });

        // Force shutdown after 30 seconds
        setTimeout(() => {
            console.error('Forced shutdown after timeout');
            process.exit(1);
        }, 30000);
    } else {
        process.exit(0);
    }
};

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

module.exports = app;
