const jwtUtils = require('../utils/jwt');
const AppError = require('../utils/appError');
const userRepository = require('../repositories/user.repository');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw AppError.unauthorized('Token required');
        }

        const decoded = jwtUtils.verifyJwt(token);

        const user = await userRepository.findOne(
            { _id: decoded.userId },
            { select: 'companyId' }
        );

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            companyId: user?.companyId || null,
        };

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;
