const {
    createTask,
    getTasks,
    getPaginatedTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskCounts,
} = require('../services/task.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const createTaskHandler = asyncHandler(async (req, res) => {
    try {
        const task = await createTask(req.body, req.user?.id, req.user?.companyId);
        logger.info('Task created', { taskId: task._id, companyId: req.user?.companyId });
        return sendCreated(res, task, 'Task created successfully');
    } catch (error) {
        logger.warn('Create task failed', { error: error.message, companyId: req.user?.companyId });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'createTask' });
    }
});

const getTasksHandler = asyncHandler(async (req, res) => {
    try {
        const result = await getPaginatedTasks(req.query, {
            companyId: req.user?.companyId,
            userId: req.user?.id,
            userRole: req.user?.role,
        });
        logger.info('Tasks fetched', { companyId: req.user?.companyId, page: req.query.page, limit: req.query.limit });
        return sendSuccess(res, result, 'Tasks retrieved successfully');
    } catch (error) {
        logger.error('Get tasks failed', { error: error.message });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTasks' });
    }
});

const getTaskByIdHandler = asyncHandler(async (req, res) => {
    try {
        const task = await getTaskById(req.params.id, { companyId: req.companyId });
        logger.info('Task fetched by ID', { taskId: req.params.id });
        return sendSuccess(res, task, 'Task retrieved successfully');
    } catch (error) {
        logger.warn('Get task by ID failed', { error: error.message, taskId: req.params.id });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTaskById' });
    }
});

const updateTaskHandler = asyncHandler(async (req, res) => {
    try {
        const task = await updateTask(req.params.id, req.body, req.user?.id);
        logger.info('Task updated', { taskId: req.params.id });
        return sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
        logger.error('Update task failed', { error: error.message, taskId: req.params.id });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'updateTask' });
    }
});

const deleteTaskHandler = asyncHandler(async (req, res) => {
    try {
        const task = await deleteTask(req.params.id, req.user?.id);
        logger.info('Task deleted', { taskId: req.params.id });
        return sendSuccess(res, task, 'Task deleted successfully');
    } catch (error) {
        logger.error('Delete task failed', { error: error.message, taskId: req.params.id });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'deleteTask' });
    }
});

const getTaskCountsHandler = asyncHandler(async (req, res) => {
    try {
        const counts = await getTaskCounts({
            companyId: req.user?.companyId,
            userId: req.user?.id,
            userRole: req.user?.role,
        });
        logger.info('Task counts fetched', { companyId: req.user?.companyId });
        return sendSuccess(res, counts, 'Task counts retrieved successfully');
    } catch (error) {
        logger.error('Get task counts failed', { error: error.message });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getTaskCounts' });
    }
});

module.exports = {
    createTaskHandler,
    getTasksHandler,
    getTaskByIdHandler,
    updateTaskHandler,
    deleteTaskHandler,
    getTaskCountsHandler,
};
