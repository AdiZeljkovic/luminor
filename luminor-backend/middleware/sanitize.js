const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

// Create DOMPurify instance for server-side use
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize HTML content to prevent XSS attacks
 * Use this on user-generated content before saving to database
 */
const sanitizeHTML = (dirty) => {
    if (!dirty) return '';

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'blockquote', 'code', 'pre',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'span', 'hr',
            'mark', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'target', 'rel',
            'src', 'alt', 'width', 'height',
            'class', 'id',
            'colspan', 'rowspan'
        ],
        KEEP_CONTENT: true
    });
};

/**
 * Middleware to sanitize blog post content
 * Automatically sanitizes content fields before they reach the controller
 */
const sanitizeBlogContent = (req, res, next) => {
    if (req.body.content_en) {
        req.body.content_en = sanitizeHTML(req.body.content_en);
    }

    if (req.body.content_bs) {
        req.body.content_bs = sanitizeHTML(req.body.content_bs);
    }

    if (req.body.excerpt_en) {
        req.body.excerpt_en = sanitizeHTML(req.body.excerpt_en);
    }

    if (req.body.excerpt_bs) {
        req.body.excerpt_bs = sanitizeHTML(req.body.excerpt_bs);
    }

    next();
};

module.exports = { sanitizeHTML, sanitizeBlogContent };
