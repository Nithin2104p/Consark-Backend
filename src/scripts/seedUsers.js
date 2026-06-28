const connectDatabase = require('../config/db');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const Company = require('../models/company.model');
const bcrypt = require('bcryptjs');
const { SAMPLE_USERS } = require('../constants/rolesPermissions');

const seedUsers = async () => {
    await connectDatabase();

    const defaultCompany = await Company.findOne({ name: 'Acme Corp' });
    const companyId = defaultCompany ? defaultCompany._id : null;

    for (const u of SAMPLE_USERS) {
        const role = await Role.findOne({ name: u.role });
        if (!role) {
            console.warn(`Role ${u.role} not found. Skipping user ${u.email}`);
            continue;
        }

        const hashed = await bcrypt.hash(u.password, 10);

        await User.findOneAndUpdate(
            { email: u.email },
            {
                $set: {
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    password: hashed,
                    isActive: true,
                    companyId,
                },
            },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    }

    console.log('Users seeded/updated.');
    process.exit(0);
};

seedUsers().catch((err) => {
    console.error('Failed seeding users:', err);
    process.exit(1);
});
