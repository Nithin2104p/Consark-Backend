const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const userRoleRepository = require('../repositories/userRole.repository');
const emailService = require('./email.service');
const { generateSetPasswordToken } = require('./setPassword.service');
const AppError = require('../utils/appError');
const env = require('../config/env');

const buildUserFilter = (query = {}) => {
    const filter = {};
    if (query.search) {
        filter.$or = [
            { firstName: { $regex: query.search, $options: 'i' } },
            { lastName: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
        ];
    }
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
    }
    return filter;
};

const createUser = async (userData, companyId) => {
    try {
        const roleId = userData.roleId;
        delete userData.roleId;

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const createdUser = await userRepository.createOne({
            ...userData,
            companyId,
        });

        if (roleId) {
            const roleRecord = await roleRepository.findOne({ name: roleId });
            if (roleRecord) {
                await userRoleRepository.updateOne(
                    { user: createdUser._id, role: roleRecord._id },
                    {
                        user: createdUser._id,
                        role: roleRecord._id,
                        assignedAt: new Date(),
                    },
                    {
                        queryOptions: { upsert: true },
                        setDefaultsOnInsert: true,
                    }
                );
            }
        }

        if (!userData.password && createdUser.email) {
            const token = generateSetPasswordToken(createdUser._id, createdUser.email);
            const resetLink = `${env.frontendUrl}/set-password?token=${token}`;
            await emailService.sendSetPasswordEmail(createdUser.email, resetLink);
        }

        return createdUser;
    } catch (error) {
        if (error.code === 11000) {
            const keyPattern = error.keyPattern || error.keyValue || {};
            const fields = Object.keys(keyPattern).filter((key) => key !== '__v');
            if (fields.includes('email') && fields.includes('companyId')) {
                throw AppError.conflict('User already exists in this company', null, { source: 'createUser' });
            }
            const field = fields[0];
            throw AppError.conflict(field ? `${field} already exists` : 'Duplicate entry', null, { source: 'createUser' });
        }
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'createUser' });
    }
};

const getUsers = async (companyId, options = {}, queryFilters = {}) => {
    try {
        const filter = { companyId, ...buildUserFilter(queryFilters) };
        return userRepository.findMany(filter, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUsers' });
    }
};

const getPaginatedUsers = async (companyId, query = {}) => {
    try {
        const page = query.page ? Math.max(Number(query.page), 1) : 1;
        const limit = query.limit ? Number(query.limit) : 10;
        const skip = (page - 1) * limit;

        const options = {
            skip,
            limit,
            sort: query.sort || '-createdAt',
        };

        const [users, total] = await Promise.all([
            getUsers(companyId, options, query),
            getUserCount(companyId, { where: buildUserFilter(query) }),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getPaginatedUsers' });
    }
};

const getUserById = async (id, options = {}) => {
    try {
        return userRepository.findById(id, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserById' });
    }
};

const getUserByIdWithTasks = async (id, companyId) => {
    try {
        const [user, tasks] = await Promise.all([
            getUserById(id),
            getTasksByUserId(id, companyId),
        ]);

        if (!user || !companyId || user.companyId?.toString() !== companyId?.toString()) {
            throw AppError.notFound('User not found in your company', null, { source: 'getUserByIdWithTasks' });
        }

        return { user, tasks };
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserByIdWithTasks' });
    }
};

const updateUser = async (id, updateData, options = {}) => {
    try {
        return userRepository.updateOne({ _id: id }, updateData, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'updateUser' });
    }
};

const deleteUser = async (id, options = {}) => {
    try {
        return userRepository.deleteOne({ _id: id }, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'deleteUser' });
    }
};

const getUserCount = async (companyId, options = {}) => {
    try {
        const filter = { companyId, ...(options.where || {}) };
        return userRepository.countDocuments(filter, options);
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserCount' });
    }
};

const getUserCompanies = async (email) => {
    try {
        const userCompanies = await userRepository.findMany(
            { email, deletedAt: null },
            { select: 'companyId' }
        );
        const companyIds = [...new Set(userCompanies.map((u) => u.companyId).filter(Boolean))];
        if (companyIds.length === 0) return [];
        const companyRepository = require('../repositories/company.repository');
        const companies = await companyRepository.findMany({ _id: { $in: companyIds } });
        return companies;
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'getUserCompanies' });
    }
};

module.exports = {
    createUser,
    getUsers,
    getPaginatedUsers,
    getUserById,
    getUserByIdWithTasks,
    updateUser,
    deleteUser,
    getUserCount,
    getUserCompanies,
};
