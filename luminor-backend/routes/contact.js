const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { ContactMessage } = require('../models');
const { auth } = require('../middleware/auth');
const { getIO } = require('../config/socket');

const router = express.Router();

// Rate limiting for contact form - stricter than general API
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per hour
  message: { success: false, error: 'Too many contact requests, please try again later.' }
});

/**
 * @route   POST /api/contact/send
 * @desc    Send contact message
 * @access  Public
 */
router.post('/send', contactLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  body('service').optional().isIn(['web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'hosting', 'other']),
  body('budget_range').optional().isIn(['exploring', '1000_5000', '5000_15000', '15000_50000', 'over_50000'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, subject, message, service, budget_range } = req.body;

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Save to database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      service,
      budget_range: budget_range || null,
      ip_address: ipAddress,
      user_agent: userAgent
    });

    // Send email notification
    try {
      await sendEmailNotification({ name, email, phone, subject, message, service, budget_range });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    // Notify all connected admins in real-time
    try {
      const io = getIO();
      io.of('/admin').emit('contact:new', {
        id: contactMessage.id,
        name,
        email,
        subject,
        createdAt: contactMessage.createdAt
      });
    } catch (_) { /* socket may not be ready, ignore */ }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages (Admin)
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: messages } = await ContactMessage.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit
    });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route   PUT /api/contact/:id
 * @desc    Update message status (Admin)
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    const { status, notes } = req.body;

    if (status && ['new', 'in_progress', 'contacted', 'proposal_sent', 'closed_won', 'closed_lost', 'archived'].includes(status)) {
      message.status = status;
    }

    if (notes !== undefined) {
      message.notes = notes;
    }

    await message.save();

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete a message (Admin)
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    await message.destroy();

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/**
 * Send email notification to admin
 */
async function sendEmailNotification({ name, email, phone, subject, message, service, budget_range }) {
  // Skip if email not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('Email not configured, skipping notification');
    return;
  }

  const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const serviceLabels = {
    'web-development': 'Web Development',
    'graphic-design': 'Graphic Design',
    'digital-marketing': 'Digital Marketing',
    'seo': 'SEO',
    'ai-automation': 'AI & Automation',
    'hosting': 'Hosting',
    'other': 'Other'
  };

  const budgetLabels = {
    'exploring': 'Just exploring / Not sure yet',
    '1000_5000': '€1,500–€5,000',
    '5000_15000': '€5,000–€15,000',
    '15000_50000': '€15,000–€50,000',
    'over_50000': 'Over €50,000'
  };

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const safeService = escapeHtml(serviceLabels[service] || service || '');
  const safeBudget = escapeHtml(budgetLabels[budget_range] || '');

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${safeName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
      </tr>
      ${phone ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${safePhone}</td>
      </tr>
      ` : ''}
      ${service ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${safeService}</td>
      </tr>
      ` : ''}
      ${budget_range ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Budget</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${safeBudget}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${safeSubject}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${safeMessage}</td>
      </tr>
    </table>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@luminorsolution.com',
    to: process.env.EMAIL_TO || 'contact@luminorsolution.com',
    subject: `New Contact: ${subject}`,
    html: htmlContent
  });
}

module.exports = router;
