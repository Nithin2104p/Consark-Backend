const formatResponse = ({ success = true, statusCode = 200, message = '', data = null }) => {
    const response = {
        statusCode,
        success,
        message,
    };

    if (data !== null) {
        response.data = data;
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
