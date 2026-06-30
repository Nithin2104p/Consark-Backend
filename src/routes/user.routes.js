const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
    createUserHandler,
    getUsersHandler,
    getUserCountHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserCompaniesHandler,
} = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const {
    createUserSchema,
    updateUserSchema,
    userIdParam,
    userQuerySchema,
    userCompaniesQuerySchema,
} = require('../validations/user.validation');

const router = express.Router();

router.get('/me/companies', validate(userCompaniesQuerySchema, 'query'), getUserCompaniesHandler);

router.use(authenticate);

router.post('/', validate(createUserSchema), createUserHandler);
router.get('/', validate(userQuerySchema, 'query'), getUsersHandler);
router.get('/count', getUserCountHandler);
router.get('/:id', validate(userIdParam, 'params'), getUserByIdHandler);
router.put('/:id', validate(userIdParam, 'params'), validate(updateUserSchema), updateUserHandler);
router.delete('/:id', validate(userIdParam, 'params'), deleteUserHandler);

module.exports = router;
