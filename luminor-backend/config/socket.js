const { Server } = require('socket.io');
const { ChatSession, ChatMessage } = require('../models');

let io;

/**
 * Initialize Socket.io with the HTTP server
 */
function initSocket(httpServer) {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3002,http://localhost:3001')
        .split(',')
        .map(o => o.trim());

    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });

    // Admin namespace
    const adminNs = io.of('/admin');

    // Public chat namespace
    io.on('connection', (socket) => {
        console.log(`[Chat] Visitor connected: ${socket.id}`);

        // Visitor starts chat session
        socket.on('visitor:join', async ({ name, email, pageUrl }) => {
            try {
                const session = await ChatSession.create({
                    visitor_name: name || 'Visitor',
                    visitor_email: email || null,
                    page_url: pageUrl || null,
                    socket_id: socket.id,
                    status: 'waiting'
                });

                socket.sessionId = session.id;
                socket.join(`session:${session.id}`);

                socket.emit('session:created', {
                    sessionId: session.id,
                    message: 'Connected! An agent will be with you shortly.'
                });

                // Notify all admin connections
                adminNs.emit('session:new', {
                    id: session.id,
                    visitor_name: session.visitor_name,
                    visitor_email: session.visitor_email,
                    page_url: session.page_url,
                    status: session.status,
                    createdAt: session.createdAt
                });

                console.log(`[Chat] Session created: ${session.id} for ${name}`);
            } catch (err) {
                console.error('[Chat] Error creating session:', err);
                socket.emit('error', { message: 'Failed to start chat session' });
            }
        });

        // Visitor sends message
        socket.on('visitor:message', async ({ content }) => {
            if (!socket.sessionId || !content?.trim()) return;

            try {
                const session = await ChatSession.findByPk(socket.sessionId);
                if (!session) return;

                const msg = await ChatMessage.create({
                    session_id: socket.sessionId,
                    content: content.trim().substring(0, 2000), // Sanitize length
                    sender_type: 'visitor',
                    sender_name: session.visitor_name,
                    is_read: false
                });

                // Update unread count
                await session.increment('unread_count');

                const payload = {
                    id: msg.id,
                    session_id: socket.sessionId,
                    content: msg.content,
                    sender_type: 'visitor',
                    sender_name: session.visitor_name,
                    createdAt: msg.createdAt
                };

                // Send to session room (agent viewing this session)
                io.to(`session:${socket.sessionId}`).emit('message:new', payload);

                // Notify admin panel
                adminNs.emit('message:new', payload);

            } catch (err) {
                console.error('[Chat] Error saving visitor message:', err);
            }
        });

        // Visitor typing indicator
        socket.on('visitor:typing', ({ isTyping }) => {
            if (!socket.sessionId) return;
            io.to(`session:${socket.sessionId}`).emit('visitor:typing', { isTyping });
            adminNs.emit('visitor:typing', { sessionId: socket.sessionId, isTyping });
        });

        socket.on('disconnect', async () => {
            if (socket.sessionId) {
                try {
                    await ChatSession.update(
                        { status: 'closed', socket_id: null },
                        { where: { id: socket.sessionId } }
                    );
                    adminNs.emit('session:closed', { sessionId: socket.sessionId });
                    console.log(`[Chat] Session ${socket.sessionId} closed (disconnect)`);
                } catch (err) {
                    console.error('[Chat] Error closing session:', err);
                }
            }
        });
    });

    // Admin namespace events
    adminNs.on('connection', (socket) => {
        console.log(`[Chat] Admin connected: ${socket.id}`);

        // Admin joins session room to receive messages
        socket.on('admin:join_session', (sessionId) => {
            socket.join(`session:${sessionId}`);
        });

        // Agent sends message to visitor
        socket.on('agent:message', async ({ sessionId, content, agentName }) => {
            if (!sessionId || !content?.trim()) return;

            try {
                const session = await ChatSession.findByPk(sessionId);
                if (!session) return;

                if (session.status === 'waiting') {
                    await session.update({ status: 'active' });
                }

                const msg = await ChatMessage.create({
                    session_id: sessionId,
                    content: content.trim().substring(0, 2000),
                    sender_type: 'agent',
                    sender_name: agentName || 'Support',
                    is_read: true
                });

                const payload = {
                    id: msg.id,
                    session_id: sessionId,
                    content: msg.content,
                    sender_type: 'agent',
                    sender_name: agentName || 'Support',
                    createdAt: msg.createdAt
                };

                // Send to visitor in this session
                io.to(`session:${sessionId}`).emit('message:new', payload);

                // Broadcast to all admin connections (for multi-agent awareness)
                adminNs.emit('message:new', payload);

            } catch (err) {
                console.error('[Chat] Error saving agent message:', err);
            }
        });

        // Agent typing indicator
        socket.on('agent:typing', ({ sessionId, isTyping, agentName }) => {
            io.to(`session:${sessionId}`).emit('agent:typing', { isTyping, agentName });
        });

        // Admin closes session
        socket.on('session:close', async (sessionId) => {
            try {
                await ChatSession.update({ status: 'closed' }, { where: { id: sessionId } });
                io.to(`session:${sessionId}`).emit('session:ended', { message: 'Chat session ended by agent.' });
                adminNs.emit('session:closed', { sessionId });
            } catch (err) {
                console.error('[Chat] Error closing session:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Chat] Admin disconnected: ${socket.id}`);
        });
    });

    console.log('✅ Socket.io initialized');
    return io;
}

function getIO() {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
}

module.exports = { initSocket, getIO };
