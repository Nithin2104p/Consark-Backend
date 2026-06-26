const { ZodError } = require('zod');
const AppError = require('../utils/appError');

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        try {
            req[property] = schema.parse(req[property]);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((issue) => ({
                    field: issue.path.join('.') || property,
                    message: issue.message,
                }));
                return next(AppError.badRequest('Validation failed', errors));
            }
            return next(error);
        }
    };
};

module.exports = validate;
