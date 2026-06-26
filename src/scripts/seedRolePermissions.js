const connectDatabase = require('../config/db');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const RolePermission = require('../models/rolePermission.model');
const { ROLES } = require('../constants/rolesPermissions');

const seedRolePermissions = async () => {
    await connectDatabase();

    for (const r of ROLES) {
        const role = await Role.findOne({ name: r.name });
        if (!role) {
            console.warn(`Role ${r.name} not found. Skipping mappings.`);
            continue;
        }

        for (const code of r.permissionCodes) {
            const perm = await Permission.findOne({ code });
            if (!perm) {
                console.warn(`Permission ${code} not found. Skipping.`);
                continue;
            }

            await RolePermission.findOneAndUpdate(
                { role: role._id, permission: perm._id },
                { $set: { role: role._id, permission: perm._id } },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
        }
    }

    console.log('Role -> Permission mappings seeded/updated.');
    process.exit(0);
};

seedRolePermissions().catch((err) => {
    console.error('Failed seeding role-permission mappings:', err);
    process.exit(1);
});
