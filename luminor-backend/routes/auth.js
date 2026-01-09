const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin user
 * @access  Public (should be restricted in production)
 */
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, email, password });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token
        user.refresh_token = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token
        user.refresh_token = refreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ success: false, error: 'Refresh token required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user with matching refresh token
        const user = await User.findByPk(decoded.id);
        if (!user || user.refresh_token !== refreshToken) {
            return res.status(401).json({ success: false, error: 'Invalid refresh token' });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        // Update refresh token
        user.refresh_token = newRefreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth, async (req, res) => {
    try {
        // Clear refresh token
        await User.update({ refresh_token: null }, { where: { id: req.user.id } });

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
});

// Helper functions
function generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
}

function generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    });
}

module.exports = router;
