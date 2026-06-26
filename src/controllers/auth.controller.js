const { signup, login } = require('../services/auth.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const signupHandler = asyncHandler(async (req, res) => {
    const result = await signup(req.body);
    return sendCreated(res, result, 'Signup successful');
});

const loginHandler = asyncHandler(async (req, res) => {
    const result = await login(req.body);
    return sendSuccess(res, result, 'Login successful');
});

module.exports = {
    signupHandler,
    loginHandler,
};