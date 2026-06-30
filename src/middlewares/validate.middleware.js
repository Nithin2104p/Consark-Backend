const { ZodError } = require('zod');
const AppError = require('../utils/appError');

const ALLOWED_PROPERTIES = ['body', 'query', 'params'];

const validate = (schema, property = 'body') => {
    if (!ALLOWED_PROPERTIES.includes(property)) {
        throw new Error(`Invalid validation target: ${property}`);
    }
    return (req, res, next) => {
        try {
            req[property] = schema.parse(req[property]);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
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

