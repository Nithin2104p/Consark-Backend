const connectDatabase = require('../config/db');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const UserRole = require('../models/userRole.model');
const { SAMPLE_USERS } = require('../constants/rolesPermissions');

const seedUserRoles = async () => {
    await connectDatabase();

    for (const u of SAMPLE_USERS) {
        const user = await User.findOne({ email: u.email });
        if (!user) {
            console.warn(`User ${u.email} not found. Skipping mapping.`);
            continue;
        }

        const role = await Role.findOne({ name: u.role });
        if (!role) {
            console.warn(`Role ${u.role} not found. Skipping mapping for ${u.email}.`);
            continue;
        }

        await UserRole.findOneAndUpdate(
            { user: user._id, role: role._id },
            { $set: { user: user._id, role: role._id, assignedAt: new Date() } },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    }

    console.log('User -> Role mappings seeded/updated.');
    process.exit(0);
};

seedUserRoles().catch((err) => {
    console.error('Failed seeding user-role mappings:', err);
    process.exit(1);
});
