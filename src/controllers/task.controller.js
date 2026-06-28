const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskCounts,
} = require('../services/task.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const createTaskHandler = asyncHandler(async (req, res) => {
    try {
        const task = await createTask(req.body, req.user?.id, req.user?.companyId);
        return sendCreated(res, task, 'Task created successfully');
    } catch (error) {
        throw new AppError(`createTaskHandler: ${error.message}`, error.statusCode || 500);
    }
});

const getTasksHandler = asyncHandler(async (req, res) => {
    try {
        const tasks = await getTasks(req.query, {
            companyId: req.user?.companyId,
            userId: req.user?.id,
            userRole: req.user?.role,
        });
        return sendSuccess(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
        throw new AppError(`getTasksHandler: ${error.message}`, error.statusCode || 500);
    }
});

const getTaskByIdHandler = asyncHandler(async (req, res) => {
    try {
        const task = await getTaskById(req.params.id, { companyId: req.companyId });
        return sendSuccess(res, task, 'Task retrieved successfully');
    } catch (error) {
        throw new AppError(`getTaskByIdHandler: ${error.message}`, error.statusCode || 500);
    }
});

const updateTaskHandler = asyncHandler(async (req, res) => {
    try {
        const task = await updateTask(req.params.id, req.body, req.user?.id);
        return sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
        throw new AppError(`updateTaskHandler: ${error.message}`, error.statusCode || 500);
    }
});

const deleteTaskHandler = asyncHandler(async (req, res) => {
    try {
        const task = await deleteTask(req.params.id, req.user?.id);
        return sendSuccess(res, task, 'Task deleted successfully');
    } catch (error) {
        throw new AppError(`deleteTaskHandler: ${error.message}`, error.statusCode || 500);
    }
});

const getTaskCountsHandler = asyncHandler(async (req, res) => {
    try {
        const counts = await getTaskCounts({
            companyId: req.user?.companyId,
            userId: req.user?.id,
            userRole: req.user?.role,
        });
        return sendSuccess(res, counts, 'Task counts retrieved successfully');
    } catch (error) {
        throw new AppError(`getTaskCountsHandler: ${error.message}`, error.statusCode || 500);
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
