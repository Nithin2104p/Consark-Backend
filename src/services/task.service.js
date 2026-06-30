const taskRepository = require('../repositories/task.repository');
const AppError = require('../utils/appError');
const Task = require('../models/task.model');

const createTask = async (taskData, userId, companyId) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required');
        }

        const sanitized = { ...taskData };
        if (sanitized.assignedTo === 'self') {
            delete sanitized.assignedTo;
        }

        const payload = {
            ...sanitized,
            createdBy: userId,
            companyId,
        };

        return taskRepository.createOne(payload);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'createTask' });
    }
};

const buildTasksQuery = (query = {}, options = {}) => {
    try {
        const {
            search,
            status,
            priority,
            createdBy,
            assignedTo,
            limit,
            sort,
            page,
        } = query;

        const filter = {};

        if (options.companyId) filter.companyId = options.companyId;
        if (options.userRole === 'user' && options.userId) filter.createdBy = options.userId;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (createdBy) filter.createdBy = createdBy;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const queryOptions = {
            sort: sort || '-createdAt',
            ...(limit ? { limit: Number(limit) } : {}),
        };

        if (page) {
            const pageNum = Math.max(Number(page), 1);
            const limitNum = queryOptions.limit || 10;
            queryOptions.skip = (pageNum - 1) * limitNum;
        } else if (query.skip) {
            queryOptions.skip = Number(query.skip);
        }

        return { filter, options: queryOptions };
    } catch (error) {
        throw new AppError(`buildTasksQuery: ${error.message}`, 500);
    }
};

const getTasks = async (query = {}, options = {}) => {
    try {
        const { filter, options: queryOptions } = buildTasksQuery(query, options);
        return taskRepository.findMany(filter, queryOptions);
    } catch (error) {
        throw new AppError(`getTasks: ${error.message}`, error.statusCode || 500);
    }
};

const getPaginatedTasks = async (query = {}, options = {}) => {
    try {
        const page = query.page ? Math.max(Number(query.page), 1) : 1;
        const limit = query.limit ? Number(query.limit) : 10;
        const skip = (page - 1) * limit;

        const taskQuery = {
            ...query,
            limit: String(limit),
            skip: String(skip),
        };

        const { filter, options: queryOptions } = buildTasksQuery(taskQuery, options);

        const [tasks, total] = await Promise.all([
            taskRepository.findMany(filter, queryOptions),
            taskRepository.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getPaginatedTasks' });
    }
};

const getTaskById = async (id, options = {}) => {
    try {
        const filter = { _id: id };
        if (options.companyId) filter.companyId = options.companyId;
        return taskRepository.findById(filter, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTaskById' });
    }
};

const updateTask = async (id, updateData, userId, companyId, options = {}) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required', null, { source: 'updateTask' });
        }

        const sanitized = { ...updateData };
        delete sanitized.createdBy;

        const filter = { _id: id };
        if (companyId) filter.companyId = companyId;

        return taskRepository.updateOne(filter, sanitized, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'updateTask' });
    }
};

const deleteTask = async (id, userId, companyId, options = {}) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required', null, { source: 'deleteTask' });
        }

        const filter = { _id: id };
        if (companyId) filter.companyId = companyId;

        return taskRepository.deleteOne(filter, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'deleteTask' });
    }
};

const getTasksByUserId = async (userId, companyId) => {
    try {
        const filter = {
            $or: [{ assignedTo: userId }, { createdBy: userId }],
        };
        if (companyId) filter.companyId = companyId;
        return taskRepository.findMany(filter);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTasksByUserId' });
    }
};

const getTaskCounts = async (options = {}) => {
    try {
        const filter = buildTasksQuery({}, options).filter;

        const result = await Task.aggregate([
            { $match: filter },
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    byStatus: [
                        { $group: { _id: '$status', count: { $sum: 1 } } },
                    ],
                },
            },
        ]);

        const [facet] = result;
        const totalTasks = facet?.total?.[0]?.count || 0;
        const byStatus = facet?.byStatus?.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {}) || {};

        return {
            totalTasks,
            openTasks: byStatus['Open'] || 0,
            inProgressTasks: byStatus['In-Progress'] || 0,
            completedTasks: byStatus['Completed'] || 0,
        };
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTaskCounts' });
    }
};

module.exports = {
    createTask,
    getTasks,
    getPaginatedTasks,
    getTaskById,
    getTasksByUserId,
    updateTask,
    deleteTask,
    getTaskCounts,
};
