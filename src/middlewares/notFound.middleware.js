const AppError = require('../utils/appError');

const notFoundMiddleware = (req, res, next) => {
    next(AppError.notFound(`Route not found: ${req.originalUrl}`));
};

module.exports = notFoundMiddleware;