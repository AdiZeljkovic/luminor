const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Simple File-based Logger
 * Logs errors and requests to files for monitoring
 */

const logFile = (filename, message) => {
    const timestamp = new Date().toISOString();
    const logPath = path.join(logsDir, filename);
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFile(logPath, logEntry, (err) => {
        if (err) console.error('Failed to write log:', err);
    });
};

/**
 * Error Logger Middleware
 * Logs all errors to error.log file
 */
const errorLogger = (err, req, res, next) => {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    };

    logFile('error.log', JSON.stringify(errorDetails));

    // Console log in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('ERROR:', errorDetails);
    }

    next(err);
};

/**
 * Request Logger Middleware
 * Logs all incoming requests for monitoring
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log after response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const requestDetails = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };

        // Log to file
        if (process.env.LOG_REQUESTS === 'true') {
            logFile('access.log', JSON.stringify(requestDetails));
        }

        // Console log slow requests (>1s)
        if (duration > 1000) {
            console.warn('SLOW REQUEST:', requestDetails);
        }
    });

    next();
};

/**
 * Security Event Logger
 * Logs security-related events (failed logins, blocked requests, etc.)
 */
const logSecurityEvent = (event, details) => {
    const logEntry = {
        event,
        ...details,
        timestamp: new Date().toISOString()
    };

    logFile('security.log', JSON.stringify(logEntry));

    // Also console log security events
    console.warn('SECURITY EVENT:', logEntry);
};

module.exports = {
    errorLogger,
    requestLogger,
    logSecurityEvent
};
