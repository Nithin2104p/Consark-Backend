const connectDatabase = require('../config/db');
const Company = require('../models/company.model');

const seedCompanies = async () => {
    await connectDatabase();

    const companies = [
        {
            name: 'Acme Corp',
            industry: 'Technology',
            website: 'https://acme.example.com',
        },
    ];

    for (const company of companies) {
        await Company.findOneAndUpdate(
            { name: company.name },
            { $set: company },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    }

    console.log('Companies seeded/updated.');
    process.exit(0);
};

seedCompanies().catch((err) => {
    console.error('Failed seeding companies:', err);
    process.exit(1);
});
