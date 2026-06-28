const withErrorContext = (methodName, fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const contextualError = new Error(`${methodName}: ${error.message}`);
            contextualError.originalError = error;
            contextualError.statusCode = error.statusCode;
            contextualError.isOperational = error.isOperational;
            throw contextualError;
        }
    };
};

module.exports = { withErrorContext };
