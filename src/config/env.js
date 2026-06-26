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
};
