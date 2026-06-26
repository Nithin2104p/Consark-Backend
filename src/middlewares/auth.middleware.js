const jwtUtils = require('../utils/jwt');
const AppError = require('../utils/appError');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw AppError.unauthorized('Token required');
        }

        const decoded = jwtUtils.verifyJwt(token);

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;
