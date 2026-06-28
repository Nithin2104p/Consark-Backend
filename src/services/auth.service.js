const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const userRoleRepository = require('../repositories/userRole.repository');
const rolePermissionRepository = require('../repositories/rolePermission.repository');
require('../models/permission.model');
const companyService = require('./company.service');
const AppError = require('../utils/appError');

const getUserByEmail = async (email) => {
    try {
        return userRepository.findOne({ email });
    } catch (error) {
        throw new AppError(`getUserByEmail: ${error.message}`, error.statusCode || 500);
    }
};

const fetchRoleAndPermissions = async (roleId) => {
    try {
        const [role, rolePermissions] = await Promise.all([
            roleRepository.findById(roleId),
            rolePermissionRepository.findByRole(roleId, { populate: 'permission' }),
        ]);

        const permissions = rolePermissions
            .map((rp) => rp.permission)
            .filter((p) => p != null);

        return {
            role,
            permissions,
        };
    } catch (error) {
        throw new AppError(`fetchRoleAndPermissions: ${error.message}`, error.statusCode || 500);
    }
};

const signup = async ({ firstName, lastName, email, password, role = 'super_admin', companyName }) => {
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw new AppError('Email already in use', 409);
        }

        const roleRecord = await roleRepository.findOne({ name: role });
        if (!roleRecord) {
            throw new AppError(`Role not found: ${role}`, 404);
        }

        const company = await companyService.createCompany(companyName);

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isActive: true,
            companyId: company._id,
        };

        const savedUser = await userRepository.createOne(userData);

        await userRoleRepository.updateOne(
            { user: savedUser._id, role: roleRecord._id },
            { user: savedUser._id, role: roleRecord._id, assignedAt: new Date() },
            { queryOptions: { upsert: true }, setDefaultsOnInsert: true }
        );

        const { permissions } = await fetchRoleAndPermissions(roleRecord._id);

        const token = jwtUtils.signJwt({ userId: savedUser._id, email: savedUser.email, role: roleRecord.name });

        return {
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                role: roleRecord.name,
                companyId: company._id,
                companyName: company.name,
            },
            roles: [roleRecord],
            permissions,
            token,
        };
    } catch (error) {
        throw new AppError(`signup: ${error.message}`, error.statusCode || 500);
    }
};

const login = async ({ email, password }) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const userRoles = await userRoleRepository.findMany(
            { user: user._id },
            { populate: 'role' }
        );
        const roleRecords = (userRoles || []).map((ur) => ur.role).filter((r) => r != null);
        const roleName = roleRecords[0]?.name || 'user';

        const permissionPromises = (roleRecords || []).map((role) =>
            role ? fetchRoleAndPermissions(role._id) : Promise.resolve({ permissions: [] })
        );
        const permissionResults = await Promise.all(permissionPromises);
        const permissions = permissionResults.flatMap((result) => result.permissions);

        const token = jwtUtils.signJwt({ userId: user._id, email: user.email, role: roleName });

        return {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: roleName,
            },
            roles: roleRecords,
            permissions,
            token,
        };
    } catch (error) {
        throw new AppError(`login: ${error.message}`, error.statusCode || 500);
    }
};

module.exports = {
    signup,
    login,
    getUserByEmail,
};
