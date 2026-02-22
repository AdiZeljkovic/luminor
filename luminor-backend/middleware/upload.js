const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { fileTypeFromBuffer } = require('file-type');
const fs = require('fs').promises;
const sharp = require('sharp');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        // SECURITY: Use crypto for better randomness and sanitize extension
        const randomName = crypto.randomBytes(16).toString('hex');
        const sanitizedExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
        cb(null, `${randomName}${sanitizedExt}`);
    }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
    // SECURITY: Strict MIME type and extension validation
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExtensions = /\.(jpeg|jpg|png|webp|gif)$/i;

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        // TODO: For maximum security, implement magic bytes validation using 'file-type' package
        // to verify actual file content, not just MIME type and extension
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * SECURITY: Magic Bytes Validation Middleware
 * Verifies actual file content, not just MIME type and extension
 * This prevents malicious files disguised as images
 */
const validateFileType = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const filePath = req.file.path;
        const buffer = await fs.readFile(filePath);

        // Get actual file type from magic bytes
        const fileType = await fileTypeFromBuffer(buffer);

        // Allowed image MIME types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (!fileType || !allowedTypes.includes(fileType.mime)) {
            // Delete the uploaded file
            await fs.unlink(filePath);

            return res.status(400).json({
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
            });
        }

        // File is valid, continue
        next();
    } catch (error) {
        console.error('File type validation error:', error);

        // Try to delete the file if it exists
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to delete invalid file:', unlinkError);
            }
        }

        return res.status(500).json({
            success: false,
            error: 'File validation failed'
        });
    }
};

/**
 * PERFORMANCE: Image Optimization Middleware
 * Automatically optimizes uploaded images for web performance
 * - Resizes large images to max 2000px width
 * - Compresses images to reduce file size
 * - Converts to WebP for better compression (optional)
 */
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const filePath = req.file.path;
        const fileExt = path.extname(filePath).toLowerCase();

        // Skip GIFs (animated images)
        if (fileExt === '.gif') {
            return next();
        }

        // Read the image
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Optimization options
        const optimizationOptions = {
            jpeg: { quality: 85, progressive: true },
            png: { quality: 85, compressionLevel: 9 },
            webp: { quality: 85 }
        };

        // Resize if image is too large (max width 2000px)
        let pipeline = image;
        if (metadata.width > 2000) {
            pipeline = pipeline.resize(2000, null, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Apply format-specific optimization
        switch (metadata.format) {
            case 'jpeg':
            case 'jpg':
                pipeline = pipeline.jpeg(optimizationOptions.jpeg);
                break;
            case 'png':
                pipeline = pipeline.png(optimizationOptions.png);
                break;
            case 'webp':
                pipeline = pipeline.webp(optimizationOptions.webp);
                break;
        }

        // Save optimized image
        await pipeline.toFile(filePath + '.optimized');

        // Replace original with optimized
        await fs.unlink(filePath);
        await fs.rename(filePath + '.optimized', filePath);

        next();
    } catch (error) {
        console.error('Image optimization error:', error);
        // Continue even if optimization fails - image is still valid
        next();
    }
};

module.exports = { upload, validateFileType, optimizeImage };
