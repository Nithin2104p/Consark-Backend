const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../services/task.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createTaskHandler = asyncHandler(async (req, res) => {
    const task = await createTask(req.body, req.user?.id);
    return sendCreated(res, task, 'Task created successfully');
});

const getTasksHandler = asyncHandler(async (req, res) => {
    const tasks = await getTasks(req.query);
    return sendSuccess(res, tasks, 'Tasks retrieved successfully');
});

const getTaskByIdHandler = asyncHandler(async (req, res) => {
    const task = await getTaskById(req.params.id);
    return sendSuccess(res, task, 'Task retrieved successfully');
});

const updateTaskHandler = asyncHandler(async (req, res) => {
    const task = await updateTask(req.params.id, req.body, req.user?.id);
    return sendSuccess(res, task, 'Task updated successfully');
});

const deleteTaskHandler = asyncHandler(async (req, res) => {
    const task = await deleteTask(req.params.id, req.user?.id);
    return sendSuccess(res, task, 'Task deleted successfully');
});

module.exports = {
    createTaskHandler,
    getTasksHandler,
    getTaskByIdHandler,
    updateTaskHandler,
    deleteTaskHandler,
};
