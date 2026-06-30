const taskRepository = require('../repositories/task.repository');
const AppError = require('../utils/appError');

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

        const [tasks, total] = await Promise.all([
            getTasks(taskQuery, options),
            taskRepository.countDocuments(buildTasksQuery(query, options).filter),
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
        return taskRepository.findById(id, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTaskById' });
    }
};

const updateTask = async (id, updateData, userId, options = {}) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required', null, { source: 'updateTask' });
        }

        const sanitized = { ...updateData };
        delete sanitized.createdBy;

        return taskRepository.updateOne({ _id: id }, sanitized, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'updateTask' });
    }
};

const deleteTask = async (id, userId, options = {}) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required', null, { source: 'deleteTask' });
        }

        return taskRepository.deleteOne({ _id: id }, options);
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
        const filter = {};
        if (options.companyId) filter.companyId = options.companyId;
        if (options.userRole === 'user' && options.userId) filter.createdBy = options.userId;

    const [total, open, inProgress, completed] = await Promise.all([
        taskRepository.countDocuments(filter),
        taskRepository.countDocuments({ ...filter, status: 'Open' }),
        taskRepository.countDocuments({ ...filter, status: 'In-Progress' }),
        taskRepository.countDocuments({ ...filter, status: 'Completed' }),
    ]);

        return {
            totalTasks: total,
            openTasks: open,
            inProgressTasks: inProgress,
            completedTasks: completed,
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
