const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']),
    status: z.enum(['Open', 'In-Progress', 'Pending', 'Completed']).optional(),
    assignedTo: z.union([objectIdSchema, z.literal('self')]).optional(),
});

const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    status: z.enum(['Open', 'In Progress', 'Completed']).optional(),
    assignedTo: z.union([objectIdSchema, z.literal('self')]).optional(),
});

const taskIdParam = z.object({
    id: objectIdSchema,
});

const taskQuerySchema = z.object({
    search: z.string().optional(),
    status: z.enum(['Open', 'In-Progress', 'Pending', 'Completed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    createdBy: objectIdSchema.optional(),
    assignedTo: objectIdSchema.optional(),
    page: z.string().regex(/^[0-9]+$/, 'Page must be a number').optional(),
    limit: z.string().regex(/^[0-9]+$/, 'Limit must be a number').optional(),
    sort: z.string().optional(),
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    taskIdParam,
    taskQuerySchema,
};
