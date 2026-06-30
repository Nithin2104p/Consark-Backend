const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/appError');
const env = require('../config/env');

const generateSetPasswordToken = (userId, email) => {
    return jwt.sign(
        { userId, email, type: 'set-password' },
        env.jwtSecret,
        { expiresIn: '24h' }
    );
};

const setPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, env.jwtSecret);

        if (!decoded || decoded.type !== 'set-password') {
            throw AppError.badRequest('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await userRepository.updateOne(
            { _id: decoded.userId },
            { password: hashedPassword, status: 'Active' }
        );

        if (!updatedUser) {
            throw AppError.notFound('User not found');
        }

        return updatedUser;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error.name === 'TokenExpiredError') {
            throw AppError.badRequest('Token expired', null, { source: 'setPassword' });
        }
        if (error.name === 'JsonWebTokenError') {
            throw AppError.badRequest('Invalid token', null, { source: 'setPassword' });
        }
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'setPassword' });
    }
};

module.exports = {
    generateSetPasswordToken,
    setPassword,
};
