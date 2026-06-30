const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().optional(),
    isActive: z.boolean().optional(),
    location: z.string().optional(),
    phoneNumber: z.string().optional(),
    roleId: z.string().optional(),
});

const updateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    isActive: z.boolean().optional(),
    location: z.string().optional(),
    phoneNumber: z.string().optional(),
});

const userIdParam = z.object({
    id: objectIdSchema,
});

const setPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const userQuerySchema = z.object({
    search: z.string().optional(),
    isActive: z.enum(['true', 'false']).optional(),
    page: z.string().regex(/^[0-9]+$/, 'Page must be a number').optional(),
    limit: z.string().regex(/^[0-9]+$/, 'Limit must be a number').optional(),
    sort: z.string().optional(),
});

const userCompaniesQuerySchema = z.object({
    email: z.string().email('Invalid email address'),
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    setPasswordSchema,
    userIdParam,
    userQuerySchema,
    userCompaniesQuerySchema,
};
