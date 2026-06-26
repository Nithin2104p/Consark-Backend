const taskRepository = require('../repositories/task.repository');
const AppError = require('../utils/appError');

const createTask = async (taskData, userId) => {
    if (!userId) {
        throw AppError.unauthorized('Authentication required');
    }

    const payload = {
        ...taskData,
        createdBy: userId,
    };

    return taskRepository.createOne(payload);
};

const buildTasksQuery = (query = {}) => {
    const { status, priority, createdBy, assignedTo, limit, skip, sort } = query;

    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (createdBy) filter.createdBy = createdBy;
    if (assignedTo) filter.assignedTo = assignedTo;

    const options = {
        sort: sort || '-createdAt',
        ...(limit ? { limit: Number(limit) } : {}),
        ...(skip ? { skip: Number(skip) } : {}),
    };

    return { filter, options };
};

const getTasks = async (query = {}) => {
    const { filter, options } = buildTasksQuery(query);
    return taskRepository.findMany(filter, options);
};

const getTaskById = async (id, options = {}) => {
    return taskRepository.findById(id, options);
};

const updateTask = async (id, updateData, userId, options = {}) => {
    if (!userId) {
        throw AppError.unauthorized('Authentication required');
    }

    // prevent overriding ownership
    const sanitized = { ...updateData };
    delete sanitized.createdBy;

    return taskRepository.updateOne({ _id: id }, sanitized, options);
};

const deleteTask = async (id, userId, options = {}) => {
    if (!userId) {
        throw AppError.unauthorized('Authentication required');
    }

    return taskRepository.deleteOne({ _id: id }, options);
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
