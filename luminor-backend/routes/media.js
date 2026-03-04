const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { auth } = require('../middleware/auth');
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// GET /api/media — Admin: list all uploaded files
router.get('/', auth, async (req, res) => {
    try {
        try {
            await fs.access(UPLOADS_DIR);
        } catch {
            return res.json({ success: true, data: [] });
        }

        const filenames = (await fs.readdir(UPLOADS_DIR)).filter(f => !f.startsWith('.'));

        const files = await Promise.all(filenames.map(async filename => {
            const filePath = path.join(UPLOADS_DIR, filename);
            const stat = await fs.stat(filePath);
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
        }));

        files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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

        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        await fs.unlink(filePath);
        res.json({ success: true, message: 'File deleted' });
    } catch (error) {
        console.error('Media delete error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
