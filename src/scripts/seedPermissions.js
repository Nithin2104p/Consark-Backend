const connectDatabase = require('../config/db');
const Permission = require('../models/permission.model');
const { PERMISSIONS } = require('../constants/rolesPermissions');

const seedPermissions = async () => {
    await connectDatabase();

    for (const p of PERMISSIONS) {
        await Permission.findOneAndUpdate(
            { code: p.code },
            { $set: p },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    }

    console.log('Permissions seeded/updated.');
    process.exit(0);
};

seedPermissions().catch((err) => {
    console.error('Failed seeding permissions:', err);
    process.exit(1);
});
