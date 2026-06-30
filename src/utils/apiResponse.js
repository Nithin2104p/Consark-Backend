const SENSITIVE_KEYS = new Set(['password', '__v', 'salt', 'refreshToken', 'accessToken']);

const sanitizeValue = (value) => {
    if (value === null || value === undefined) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value instanceof Date) {
        return value;
    }

    if (typeof value === 'object') {
        const plain = JSON.parse(JSON.stringify(value));
        if (!plain || typeof plain !== 'object') return plain;

        const sanitized = {};
        for (const [key, val] of Object.entries(plain)) {
            if (SENSITIVE_KEYS.has(key)) {
                continue;
            }
            sanitized[key] = sanitizeValue(val);
        }
        return sanitized;
    }

    return value;
};

const formatResponse = ({ success = true, statusCode = 200, message = '', data = null }) => {
    const response = {
        statusCode,
        success,
        message,
    };

    if (data !== null) {
        response.data = sanitizeValue(data);
    }

    return response;
};

const sendSuccess = (res, data = null, message = 'Request successful', statusCode = 200) => {
    return res.status(statusCode).json(formatResponse({
        statusCode,
        success: true,
        message,
        data,
    }));
};

const sendCreated = (res, data = null, message = 'Resource created') => {
    return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = 'Something went wrong', statusCode = 500) => {
    return res.status(statusCode).json(formatResponse({
        statusCode,
        success: false,
        message,
    }));
};

module.exports = {
    formatResponse,
    sendSuccess,
    sendCreated,
    sendError,
};
