const { setPassword } = require('../services/setPassword.service');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate.middleware');
const { setPasswordSchema } = require('../validations/user.validation');

const setPasswordHandler = asyncHandler(async (req, res) => {
    try {
        const { token, password } = req.body;
        const updatedUser = await setPassword(token, password);
        return sendSuccess(res, updatedUser, 'Password set successfully');
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'setPassword' });
    }
});

module.exports = {
    setPasswordHandler,
    setPasswordSchema,
};
