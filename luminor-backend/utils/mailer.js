const nodemailer = require('nodemailer');

function createTransporter() {
    const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

/**
 * Send an email. Non-blocking — caller should wrap in try/catch.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
async function sendMail({ to, subject, html }) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.log('Email not configured, skipping:', subject);
        return;
    }
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@luminor.solutions',
        to,
        subject,
        html
    });
}

module.exports = { sendMail };
