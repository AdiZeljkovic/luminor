const express = require('express');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// GET /api/media — Admin: list all uploaded files
router.get('/', auth, async (req, res) => {
    try {
        if (!fs.existsSync(UPLOADS_DIR)) {
            return res.json({ success: true, data: [] });
        }

        const files = fs.readdirSync(UPLOADS_DIR)
            .filter(f => !f.startsWith('.'))
            .map(filename => {
                const filePath = path.join(UPLOADS_DIR, filename);
                const stat = fs.statSync(filePath);
                const ext = path.extname(filename).toLowerCase();
                const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].includes(ext);
                const isPdf = ext === '.pdf';

                return {
                    filename,
                    url: `/uploads/${filename}`,
                    size: stat.size,
                    type: isImage ? 'image' : isPdf ? 'pdf' : 'other',
                    mimetype: isImage ? `image/${ext.replace('.', '')}` : isPdf ? 'application/pdf' : 'application/octet-stream',
                    created_at: stat.birthtime || stat.mtime
                };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json({ success: true, data: files });
    } catch (error) {
        console.error('Media list error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// DELETE /api/media/:filename — Admin: delete a file
router.delete('/:filename', auth, async (req, res) => {
    try {
        // Security: prevent path traversal
        const filename = path.basename(req.params.filename);
        const filePath = path.join(UPLOADS_DIR, filename);

        // Ensure the resolved path is inside UPLOADS_DIR
        if (!filePath.startsWith(UPLOADS_DIR)) {
            return res.status(400).json({ success: false, error: 'Invalid filename' });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted' });
    } catch (error) {
        console.error('Media delete error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
