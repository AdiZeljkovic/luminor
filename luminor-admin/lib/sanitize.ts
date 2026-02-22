import DOMPurify from 'isomorphic-dompurify';

/**
 * HTML Sanitization Utility
 * Protects against XSS attacks by sanitizing user-generated HTML content
 */

/**
 * Sanitize HTML content for safe display
 * Use this for rendering user-generated HTML (blog posts, comments, etc.)
 */
export const sanitizeHTML = (dirty: string): string => {
    if (!dirty) return '';

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            // Text formatting
            'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre',
            // Headings
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            // Lists
            'ul', 'ol', 'li',
            // Links
            'a',
            // Images
            'img',
            // Tables
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            // Other
            'div', 'span', 'hr'
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'target', 'rel', // Links
            'src', 'alt', 'width', 'height', // Images
            'class', 'id', // Styling
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        KEEP_CONTENT: true,
        RETURN_TRUSTED_TYPE: false
    });
};

/**
 * Sanitize plain text (strip all HTML)
 * Use this for titles, meta descriptions, etc.
 */
export const sanitizePlainText = (dirty: string): string => {
    if (!dirty) return '';

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true
    });
};

/**
 * Sanitize for TipTap editor content
 * More permissive for rich text editor
 */
export const sanitizeEditorContent = (dirty: string): string => {
    if (!dirty) return '';

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'blockquote', 'code', 'pre',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'span', 'hr',
            // TipTap specific
            'mark', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'target', 'rel',
            'src', 'alt', 'width', 'height',
            'class', 'id', 'data-type', 'style',
            'colspan', 'rowspan' // Table attributes
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        KEEP_CONTENT: true
    });
};

/**
 * Example usage:
 *
 * // In a component:
 * import { sanitizeHTML } from '@/lib/sanitize';
 *
 * // Sanitize before rendering
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
 *
 * // For TipTap editor:
 * const sanitizedContent = sanitizeEditorContent(editorHTML);
 */
