const { signup, login } = require('../services/auth.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const signupHandler = asyncHandler(async (req, res) => {
    try {
        const result = await signup(req.body);
        return sendCreated(res, result, 'Signup successful');
    } catch (error) {
        throw new AppError(`signupHandler: ${error.message}`, error.statusCode || 500);
    }
});

const loginHandler = asyncHandler(async (req, res) => {
    try {
        const result = await login(req.body);
        return sendSuccess(res, result, 'Login successful');
    } catch (error) {
        throw new AppError(`loginHandler: ${error.message}`, error.statusCode || 500);
    }
});

module.exports = {
    signupHandler,
    loginHandler,
};