const taskRepository = require('../repositories/task.repository');
const AppError = require('../utils/appError');

const createTask = async (taskData, userId, companyId) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required');
        }

        const payload = {
            ...taskData,
            createdBy: userId,
            companyId,
        };

        return taskRepository.createOne(payload);
    } catch (error) {
        throw new AppError(`createTask: ${error.message}`, error.statusCode || 500);
    }
};

const buildTasksQuery = (query = {}, options = {}) => {
    try {
        const { status, priority, createdBy, assignedTo, limit, skip, sort } = query;

        const filter = {};

        if (options.companyId) filter.companyId = options.companyId;
        if (options.userRole === 'user' && options.userId) filter.createdBy = options.userId;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (createdBy) filter.createdBy = createdBy;
        if (assignedTo) filter.assignedTo = assignedTo;

        const queryOptions = {
            sort: sort || '-createdAt',
            ...(limit ? { limit: Number(limit) } : {}),
            ...(skip ? { skip: Number(skip) } : {}),
        };

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

const getTaskById = async (id, options = {}) => {
    try {
        return taskRepository.findById(id, options);
    } catch (error) {
        throw new AppError(`getTaskById: ${error.message}`, error.statusCode || 500);
    }
};

const updateTask = async (id, updateData, userId, options = {}) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required');
        }

        const sanitized = { ...updateData };
        delete sanitized.createdBy;

        return taskRepository.updateOne({ _id: id }, sanitized, options);
    } catch (error) {
        throw new AppError(`updateTask: ${error.message}`, error.statusCode || 500);
    }
};

const deleteTask = async (id, userId, options = {}) => {
    try {
        if (!userId) {
            throw AppError.unauthorized('Authentication required');
        }

        return taskRepository.deleteOne({ _id: id }, options);
    } catch (error) {
        throw new AppError(`deleteTask: ${error.message}`, error.statusCode || 500);
    }
};

const getTaskCounts = async (options = {}) => {
    try {
        const filter = {};
        if (options.companyId) filter.companyId = options.companyId;
        if (options.userRole === 'user' && options.userId) filter.createdBy = options.userId;

        const [total, open, inProgress, completed] = await Promise.all([
            taskRepository.countDocuments(filter),
            taskRepository.countByStatus('Open', filter),
            taskRepository.countByStatus('In-Progress', filter),
            taskRepository.countByStatus('Completed', filter),
        ]);

        return {
            totalTasks: total,
            openTasks: open,
            inProgressTasks: inProgress,
            completedTasks: completed,
        };
    } catch (error) {
        throw new AppError(`getTaskCounts: ${error.message}`, error.statusCode || 500);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskCounts,
};
