const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../services/user.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const createUserHandler = asyncHandler(async (req, res) => {
    try {
        const user = await createUser(req.body);
        return sendCreated(res, user, 'User created successfully');
    } catch (error) {
        throw new AppError(`createUserHandler: ${error.message}`, error.statusCode || 500);
    }
});

const getUsersHandler = asyncHandler(async (req, res) => {
    try {
        const users = await getUsers();
        return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
        throw new AppError(`getUsersHandler: ${error.message}`, error.statusCode || 500);
    }
});

const getUserByIdHandler = asyncHandler(async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        return sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
        throw new AppError(`getUserByIdHandler: ${error.message}`, error.statusCode || 500);
    }
});

const updateUserHandler = asyncHandler(async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        return sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
        throw new AppError(`updateUserHandler: ${error.message}`, error.statusCode || 500);
    }
});

const deleteUserHandler = asyncHandler(async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        return sendSuccess(res, user, 'User deleted successfully');
    } catch (error) {
        throw new AppError(`deleteUserHandler: ${error.message}`, error.statusCode || 500);
    }
});

module.exports = {
    createUserHandler,
    getUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
};