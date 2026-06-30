const mongoose = require('mongoose');
const User = require('../models/user.model');
const config = require('../config/env');

const migrate = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');

        const indexes = await User.collection.indexes();
        const hasEmailIndex = indexes.some((idx) => idx.name === 'email_1');

        if (hasEmailIndex) {
            await User.collection.dropIndex('email_1');
            console.log('Dropped old email_1 index');
        } else {
            console.log('No email_1 index found, skipping drop');
        }

        const hasCompoundIndex = indexes.some(
            (idx) => idx.name === 'companyId_1_email_1'
        );

        if (!hasCompoundIndex) {
            await User.collection.createIndex(
                { companyId: 1, email: 1 },
                { unique: true, name: 'companyId_1_email_1' }
            );
            console.log('Created compound unique index on companyId + email');
        } else {
            console.log('Compound index already exists, skipping creation');
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
