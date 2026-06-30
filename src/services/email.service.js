const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort ? Number(env.smtpPort) : 587,
    secure: false,
    auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
    },
});

const getEmailTemplate = (resetLink) => {
    const templatePath = path.join(__dirname, '..', 'templates', 'set-password-email.html');
    let html = fs.readFileSync(templatePath, 'utf-8');
    html = html.replace(/{{resetLink}}/g, resetLink);
    return html;
};

const sendSetPasswordEmail = async (toEmail, resetLink) => {
    try {
        const html = getEmailTemplate(resetLink);
        await transporter.sendMail({
            from: env.emailFrom,
            to: toEmail,
            subject: 'Set Your Password',
            html,
        });
        logger.info('Set password email sent', { toEmail });
    } catch (error) {
        logger.error('Failed to send set password email', { error: error.message, toEmail });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'sendSetPasswordEmail' });
    }
};

module.exports = {
    sendSetPasswordEmail,
};
