const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../services/user.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createUserHandler = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);
    return sendCreated(res, user, 'User created successfully');
});

const getUsersHandler = asyncHandler(async (req, res) => {
    const users = await getUsers();
    return sendSuccess(res, users, 'Users retrieved successfully');
});

const getUserByIdHandler = asyncHandler(async (req, res) => {
    const user = await getUserById(req.params.id);
    return sendSuccess(res, user, 'User retrieved successfully');
});

const updateUserHandler = asyncHandler(async (req, res) => {
    const user = await updateUser(req.params.id, req.body);
    return sendSuccess(res, user, 'User updated successfully');
});

const deleteUserHandler = asyncHandler(async (req, res) => {
    const user = await deleteUser(req.params.id);
    return sendSuccess(res, user, 'User deleted successfully');
});

module.exports = {
    createUserHandler,
    getUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
};