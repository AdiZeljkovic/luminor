const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * JWT Authentication Middleware
 * Protects routes that require authentication
 * Supports both httpOnly cookies (preferred) and Authorization header (backward compatibility)
 */
const auth = async (req, res, next) => {
    try {
        let token;

        // SECURITY: Try to get token from httpOnly cookie first (most secure)
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        // Fallback: Get token from Authorization header (for backward compatibility)
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            error: 'Token is not valid'
        });
    }
};

/**
 * Optional Auth Middleware
 * Attaches user to request if token is valid, but doesn't block request if not
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        // Silently fail - user just won't be attached
    }
    next();
};

/**
 * Admin Auth Middleware
 * Verifies token AND checks that user has admin role
 */
const adminAuth = async (req, res, next) => {
    await auth(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }
    });
};

module.exports = { auth, optionalAuth, adminAuth };
