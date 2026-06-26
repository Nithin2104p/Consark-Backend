const HTTP_STATUS = require('../constants/httpStatus');

class AppError extends Error {
    constructor(message, statusCode, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad request', errors = null) {
        return new AppError(message, HTTP_STATUS.BAD_REQUEST, errors);
    }

    static unauthorized(message = 'Unauthorized', errors = null) {
        return new AppError(message, HTTP_STATUS.UNAUTHORIZED, errors);
    }

    static forbidden(message = 'Forbidden', errors = null) {
        return new AppError(message, HTTP_STATUS.FORBIDDEN, errors);
    }

    static notFound(message = 'Resource not found', errors = null) {
        return new AppError(message, HTTP_STATUS.NOT_FOUND, errors);
    }

    static conflict(message = 'Conflict', errors = null) {
        return new AppError(message, HTTP_STATUS.CONFLICT, errors);
    }
}

module.exports = AppError;