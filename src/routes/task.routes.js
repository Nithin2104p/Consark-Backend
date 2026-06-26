const express = require('express');
const {
    createTaskHandler,
    getTasksHandler,
    getTaskByIdHandler,
    updateTaskHandler,
    deleteTaskHandler,
} = require('../controllers/task.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createTaskSchema,
    updateTaskSchema,
    taskIdParam,
    taskQuerySchema,
} = require('../validations/task.validation');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(createTaskSchema), createTaskHandler);
router.get('/', validate(taskQuerySchema, 'query'), getTasksHandler);
router.get('/:id', validate(taskIdParam, 'params'), getTaskByIdHandler);
router.put('/:id', validate(taskIdParam, 'params'), validate(updateTaskSchema), updateTaskHandler);
router.delete('/:id', validate(taskIdParam, 'params'), deleteTaskHandler);

module.exports = router;
