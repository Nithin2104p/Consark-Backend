const {
    createUser,
    getUsers,
    getPaginatedUsers,
    getUserById,
    getUserByIdWithTasks,
    updateUser,
    deleteUser,
    getUserCount,
    getUserCompanies,
} = require('../services/user.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const createUserHandler = asyncHandler(async (req, res) => {
    try {
        const user = await createUser(req.body, req.user.companyId);
        logger.info('User created', { userId: user._id, email: user.email, companyId: req.user.companyId });
        return sendCreated(res, user, 'User created successfully');
    } catch (error) {
        logger.warn('Create user failed', { error: error.message, email: req.body.email });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'createUser' });
    }
});

const getUsersHandler = asyncHandler(async (req, res) => {
    try {
        const result = await getPaginatedUsers(req.user.companyId, req.query);
        logger.info('Users fetched', { companyId: req.user.companyId, page: req.query.page, limit: req.query.limit });
        return sendSuccess(res, result, 'Users retrieved successfully');
    } catch (error) {
        logger.error('Get users failed', { error: error.message });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUsers' });
    }
});

const getUserCountHandler = asyncHandler(async (req, res) => {
    try {
        const count = await getUserCount(req.user.companyId);
        logger.info('User count fetched', { companyId: req.user.companyId, count });
        return sendSuccess(res, { count }, 'User count retrieved successfully');
    } catch (error) {
        logger.error('Get user count failed', { error: error.message });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserCount' });
    }
});

const getUserByIdHandler = asyncHandler(async (req, res) => {
    try {
        const result = await getUserByIdWithTasks(req.params.id, req.user.companyId);
        logger.info('User fetched by ID', { userId: req.params.id });
        return sendSuccess(res, result, 'User with tasks retrieved successfully');
    } catch (error) {
        logger.warn('Get user by ID failed', { error: error.message, userId: req.params.id });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserById' });
    }
});

const updateUserHandler = asyncHandler(async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        logger.info('User updated', { userId: req.params.id });
        return sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
        logger.error('Update user failed', { error: error.message, userId: req.params.id });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'updateUser' });
    }
});

const deleteUserHandler = asyncHandler(async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        logger.info('User deleted', { userId: req.params.id });
        return sendSuccess(res, user, 'User deleted successfully');
    } catch (error) {
        logger.error('Delete user failed', { error: error.message, userId: req.params.id });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'deleteUser' });
    }
});

const getUserCompaniesHandler = asyncHandler(async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            throw AppError.badRequest('Email is required', null, { source: 'getUserCompanies' });
        }
        const companies = await getUserCompanies(email);
        logger.info('User companies fetched', { email, count: companies.length });
        return sendSuccess(res, companies, 'User companies retrieved successfully');
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error('Get user companies failed', { error: error.message, email: req.query.email });
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserCompanies' });
    }
});

module.exports = {
    createUserHandler,
    getUsersHandler,
    getUserCountHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserCompaniesHandler,
};
