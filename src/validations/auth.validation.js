const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const signupSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().optional(),
    companyName: z.string().min(1, 'Company name is required'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    companyId: objectIdSchema,
});

module.exports = {
    signupSchema,
    loginSchema,
};
