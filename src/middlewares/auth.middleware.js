const jwtUtils = require('../utils/jwt');
const AppError = require('../utils/appError');
const userRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            logger.warn('Authentication failed: Token required', { ip: req.ip });
            throw AppError.unauthorized('Token required');
        }

        const decoded = (() => {
            try {
                return jwtUtils.verifyJwt(token);
            } catch (err) {
                if (err.name === 'TokenExpiredError') throw AppError.unauthorized('Token expired');
                if (err.name === 'JsonWebTokenError') throw AppError.unauthorized('Invalid token');
                throw err;
            }
        })();

        if (!decoded) {
            throw AppError.unauthorized('Invalid token');
        }

        const user = await userRepository.findOne(
            { _id: decoded.userId },
            { select: 'companyId' }
        );

        if (!user) {
            throw AppError.unauthorized('User no longer exists');
        }

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            companyId: user?.companyId || null,
        };

        logger.info('User authenticated', { userId: decoded.userId, email: decoded.email });
        next();
    } catch (error) {
        logger.warn('Authentication failed', { error: error.message });
        next(error);
    }
};

module.exports = authenticate;
