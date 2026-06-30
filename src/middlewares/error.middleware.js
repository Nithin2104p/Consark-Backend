const logger = require('../utils/logger');
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
    if (err == null) {
        return {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
            datapoints: null,
        };
    }

    const baseResult = {
        datapoints: error.datapoints || null,
    };

    if (error instanceof AppError || error.isOperational) {
        return {
            ...baseResult,
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors || [],
        };
    }

    if (error.name === 'ValidationError') {
        const validationErrors = getValidationErrors(error);
        return {
            ...baseResult,
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: 'Validation failed',
            errors: validationErrors,
        };
    }

    if (error.name === 'CastError') {
        return {
            ...baseResult,
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: `Invalid value for field: ${error.path}`,
        };
    }

    if (error.code === 11000) {
        const duplicateErrors = getDuplicateKeyErrors(error);
        return {
            ...baseResult,
            statusCode: HTTP_STATUS.CONFLICT,
            message: 'Duplicate value',
            errors: duplicateErrors,
        };
    }

    return {
        ...baseResult,
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: env.nodeEnv === 'production' ? 'Internal Server Error' : error.message || 'Internal Server Error',
    };
};

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    const { statusCode, message, errors, datapoints } = normalizeError(err);

    if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        logger.error(message, { error: err.message, stack: err.stack, datapoints });
    } else {
        logger.warn(message, { statusCode, datapoints });
    }

    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        ...(errors && errors.length ? { errors } : {}),
        ...(datapoints ? { datapoints } : {}),
    });
};

module.exports = errorMiddleware;