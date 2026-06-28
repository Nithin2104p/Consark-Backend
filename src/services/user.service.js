const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/appError');

const createUser = async (userData) => {
    try {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return userRepository.createOne(userData);
    } catch (error) {
        throw new AppError(`createUser: ${error.message}`, error.statusCode || 500);
    }
};

const getUsers = async (options = {}) => {
    try {
        return userRepository.findMany({}, options);
    } catch (error) {
        throw new AppError(`getUsers: ${error.message}`, error.statusCode || 500);
    }
};

const getUserById = async (id, options = {}) => {
    try {
        return userRepository.findById(id, options);
    } catch (error) {
        throw new AppError(`getUserById: ${error.message}`, error.statusCode || 500);
    }
};

const updateUser = async (id, updateData, options = {}) => {
    try {
        return userRepository.updateOne({ _id: id }, updateData, options);
    } catch (error) {
        throw new AppError(`updateUser: ${error.message}`, error.statusCode || 500);
    }
};

const deleteUser = async (id, options = {}) => {
    try {
        return userRepository.deleteOne({ _id: id }, options);
    } catch (error) {
        throw new AppError(`deleteUser: ${error.message}`, error.statusCode || 500);
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
