const express = require('express');
const {
    createUserHandler,
    getUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
} = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema, updateUserSchema, userIdParam } = require('../validations/user.validation');

const router = express.Router();

router.post('/', validate(createUserSchema), createUserHandler);
router.get('/', getUsersHandler);
router.get('/:id', validate(userIdParam, 'params'), getUserByIdHandler);
router.put('/:id', validate(userIdParam, 'params'), validate(updateUserSchema), updateUserHandler);
router.delete('/:id', validate(userIdParam, 'params'), deleteUserHandler);

module.exports = router;
