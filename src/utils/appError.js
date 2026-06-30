const HTTP_STATUS = require('../constants/httpStatus');

class AppError extends Error {
    constructor(message, statusCode, errors = null, datapoints = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.datapoints = datapoints;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad request', errors = null, datapoints = null) {
        return new AppError(message, HTTP_STATUS.BAD_REQUEST, errors, datapoints);
    }

    static unauthorized(message = 'Unauthorized', errors = null, datapoints = null) {
        return new AppError(message, HTTP_STATUS.UNAUTHORIZED, errors, datapoints);
    }

    static forbidden(message = 'Forbidden', errors = null, datapoints = null) {
        return new AppError(message, HTTP_STATUS.FORBIDDEN, errors, datapoints);
    }

    static notFound(message = 'Resource not found', errors = null, datapoints = null) {
        return new AppError(message, HTTP_STATUS.NOT_FOUND, errors, datapoints);
    }

    static conflict(message = 'Conflict', errors = null, datapoints = null) {
        return new AppError(message, HTTP_STATUS.CONFLICT, errors, datapoints);
    }
}

module.exports = AppError;