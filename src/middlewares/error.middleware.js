const HTTP_STATUS = require('../constants/httpStatus');
const { sendError } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const env = require('../config/env');

const getValidationErrors = (error) => {
    return Object.values(error.errors || {}).map((validationError) => ({
        field: validationError.path,
        message: validationError.message.replace(/^Path `([^`]+)`/, '$1'),
    }));
};

const getDuplicateKeyErrors = (error) => {
    return Object.keys(error.keyValue || {}).map((field) => ({
        field,
        message: `${field} already exists`,
    }));
};

const normalizeError = (error) => {
    if (!error) {
        return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
        };
    }

    const formatErrorMessage = (baseMessage, details) => {
        if (!details || !details.length) {
            return baseMessage;
        }

        const detailText = details.map((issue) => issue.message || String(issue)).join(', ');
        return `${baseMessage}: ${detailText}`;
    };

    if (error instanceof AppError || error.isOperational) {
        return {
            statusCode: error.statusCode,
            message: formatErrorMessage(error.message, error.errors || []),
        };
    }

    if (error.name === 'ValidationError') {
        const validationErrors = getValidationErrors(error);
        return {
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: formatErrorMessage('Validation failed', validationErrors),
        };
    }

    if (error.name === 'CastError') {
        return {
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: `Invalid ${error.path}: ${error.message}`,
        };
    }

    if (error.code === 11000) {
        const duplicateErrors = getDuplicateKeyErrors(error);
        return {
            statusCode: HTTP_STATUS.CONFLICT,
            message: formatErrorMessage('Duplicate value', duplicateErrors),
        };
    }

    return {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: env.nodeEnv === 'production' ? 'Internal Server Error' : error.message || 'Internal Server Error',
    };
};

const errorMiddleware = (err, req, res, next) => {
    const { statusCode, message, errors } = normalizeError(err);

    if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.error(err);
    }

    return sendError(res, message, statusCode, errors);
};

module.exports = errorMiddleware;