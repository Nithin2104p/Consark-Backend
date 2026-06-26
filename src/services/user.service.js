const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

const createUser = async (userData) => {
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    return userRepository.createOne(userData);
};

const getUsers = async (options = {}) => {
    return userRepository.findMany({}, options);
};

const getUserById = async (id, options = {}) => {
    return userRepository.findById(id, options);
};

const updateUser = async (id, updateData, options = {}) => {
    return userRepository.updateOne({ _id: id }, updateData, options);
};

const deleteUser = async (id, options = {}) => {
    return userRepository.deleteOne({ _id: id }, options);
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
