const express = require('express');
const { ChatSession, ChatMessage } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/chat/sessions
 * @desc    Get all chat sessions (Admin)
 * @access  Private
 */
router.get('/sessions', auth, async (req, res) => {
    try {
        const status = req.query.status;
        const where = status ? { status } : {};

        const sessions = await ChatSession.findAll({
            where,
            include: [{
                model: ChatMessage,
                as: 'messages',
                limit: 1,
                order: [['createdAt', 'DESC']],
                attributes: ['content', 'sender_type', 'createdAt']
            }],
            order: [['updatedAt', 'DESC']],
            limit: 100
        });

        res.json({ success: true, data: sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   GET /api/chat/sessions/:id/messages
 * @desc    Get messages for a session (Admin)
 * @access  Private
 */
router.get('/sessions/:id/messages', auth, async (req, res) => {
    try {
        const session = await ChatSession.findByPk(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        const messages = await ChatMessage.findAll({
            where: { session_id: req.params.id },
            order: [['createdAt', 'ASC']]
        });

        // Mark messages as read
        await ChatMessage.update(
            { is_read: true },
            { where: { session_id: req.params.id, sender_type: 'visitor', is_read: false } }
        );

        // Reset unread count
        await session.update({ unread_count: 0 });

        res.json({ success: true, data: messages, session });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   PUT /api/chat/sessions/:id/close
 * @desc    Close a session (Admin)
 * @access  Private
 */
router.put('/sessions/:id/close', auth, async (req, res) => {
    try {
        const session = await ChatSession.findByPk(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        await session.update({ status: 'closed' });
        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Close session error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/chat/sessions/:id
 * @desc    Delete a session and its messages (Admin)
 * @access  Private
 */
router.delete('/sessions/:id', auth, async (req, res) => {
    try {
        const session = await ChatSession.findByPk(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        await ChatMessage.destroy({ where: { session_id: req.params.id } });
        await session.destroy();

        res.json({ success: true, message: 'Session deleted' });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
