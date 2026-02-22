const express = require('express');
const router = express.Router();
const { upload, validateFileType, optimizeImage } = require('../middleware/upload');

// POST /api/upload - with magic bytes validation and optimization
router.post('/', upload.single('image'), validateFileType, optimizeImage, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        // Construct public URL
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(201).json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const fs = require('fs');
const path = require('path');
const { auth } = require('../middleware/auth');

// GET /api/upload/files - List all files
router.get('/files', auth, (req, res) => {
    const directoryPath = path.join(__dirname, '../public/uploads');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan files' });
        }

        const fileInfos = files
            .filter(file => !file.startsWith('.')) // Hide hidden files
            .map(file => {
                const stats = fs.statSync(path.join(directoryPath, file));
                return {
                    name: file,
                    url: `${req.protocol}://${req.get('host')}/uploads/${file}`,
                    size: stats.size,
                    createdAt: stats.birthtime
                };
            })
            .sort((a, b) => b.createdAt - a.createdAt); // Newest first

        res.json({ success: true, data: fileInfos });
    });
});

// DELETE /api/upload/files/:filename - Delete file
router.delete('/files/:filename', auth, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../public/uploads', filename);

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not delete file' });
        }
        res.json({ success: true, message: 'File deleted successfully' });
    });
});

module.exports = router;
