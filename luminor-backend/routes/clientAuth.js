const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { Client } = require('../models');

const router = express.Router();

const CLIENT_JWT_SECRET = process.env.CLIENT_JWT_SECRET || process.env.JWT_SECRET + '_client';
const TOKEN_EXPIRY = '7d';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' }
});

// Middleware: Verify client token
const clientAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.clientToken;
        if (!token) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, CLIENT_JWT_SECRET);
        const client = await Client.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!client || !client.is_active) {
            return res.status(401).json({ success: false, error: 'Account not found or inactive' });
        }

        req.client = client;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};

/**
 * @route   POST /api/client-auth/login
 * @access  Public
 */
router.post('/login', loginLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    try {
        const { email, password } = req.body;

        const client = await Client.findOne({ where: { email } });
        if (!client || !client.is_active) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, client.password);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: client.id, email: client.email, type: 'client' },
            CLIENT_JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.cookie('clientToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            data: {
                id: client.id,
                name: client.name,
                email: client.email,
                company: client.company
            }
        });
    } catch (error) {
        console.error('Client login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   POST /api/client-auth/logout
 * @access  Private
 */
router.post('/logout', clientAuth, (req, res) => {
    res.clearCookie('clientToken');
    res.json({ success: true });
});

/**
 * @route   GET /api/client-auth/me
 * @access  Private
 */
router.get('/me', clientAuth, (req, res) => {
    res.json({ success: true, data: req.client });
});

module.exports = { router, clientAuth };
