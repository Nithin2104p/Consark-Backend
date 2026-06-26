const connectDatabase = require('../config/db');
const Role = require('../models/role.model');
const { ROLES } = require('../constants/rolesPermissions');

const seedRoles = async () => {
    await connectDatabase();

    for (const r of ROLES) {
        await Role.findOneAndUpdate(
            { name: r.name },
            { $set: { displayName: r.displayName, description: r.description } },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    }

    console.log('Roles seeded/updated.');
    process.exit(0);
};

seedRoles().catch((err) => {
    console.error('Failed seeding roles:', err);
    process.exit(1);
});
