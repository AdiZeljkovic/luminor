const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
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

module.exports = router;
