const path = require('path');
const dotenv = require('dotenv');

const envFile = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envFile });

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    emailFrom: process.env.EMAIL_FROM,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
