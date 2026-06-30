const { signup, login } = require('../services/auth.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const signupHandler = asyncHandler(async (req, res) => {
    try {
        const result = await signup(req.body);
        logger.info('User signed up', { email: req.body.email });
        return sendCreated(res, result, 'Signup successful');
    } catch (error) {
        logger.warn('Signup failed', { error: error.message, email: req.body.email });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'signup' });
    }
});

const loginHandler = asyncHandler(async (req, res) => {
    try {
        const result = await login(req.body);
        logger.info('User logged in', { email: req.body.email });
        return sendSuccess(res, result, 'Login successful');
    } catch (error) {
        logger.warn('Login failed', { error: error.message, email: req.body.email });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'login' });
    }
});

module.exports = {
    signupHandler,
    loginHandler,
};