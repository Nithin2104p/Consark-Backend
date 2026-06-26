const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const userRoleRepository = require('../repositories/userRole.repository');

const getUserByEmail = async (email) => {
    return userRepository.findOne({ email });
};

const signup = async ({ firstName, lastName, email, password, role = 'user' }) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const roleRecord = await roleRepository.findOne({ name: role });
    if (!roleRecord) {
        throw new Error(`Role not found: ${role}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isActive: true,
    };

    const savedUser = await userRepository.createOne(userData);

    await userRoleRepository.updateOne(
        { user: savedUser._id, role: roleRecord._id },
        { user: savedUser._id, role: roleRecord._id, assignedAt: new Date() },
        { queryOptions: { upsert: true }, setDefaultsOnInsert: true }
    );

    const token = jwtUtils.signJwt({ userId: savedUser._id, email: savedUser.email, role: roleRecord.name });

    return {
        user: {
            id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            role: roleRecord.name,
        },
        token,
    };
};

const login = async ({ email, password }) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const userRole = await userRoleRepository.findOne(
        { user: user._id },
        { populate: 'role' }
    );
    const roleName = userRole?.role?.name || 'user';

    const token = jwtUtils.signJwt({ userId: user._id, email: user.email, role: roleName });

    return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: roleName,
        },
        token,
    };
};

module.exports = {
    signup,
    login,
    getUserByEmail,
};
