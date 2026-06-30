const mongoose = require("mongoose");
const env = require("./env");
const logger = require('../utils/logger');

const connectDatabase = async () => {
    try {
        // console.log("MongoDB connection URI:", env.mongoUri); // debugging
        await mongoose.connect(env.mongoUri);

        mongoose.connection.on("connected", () => {
            logger.info('MongoDB connected successfully');
        });

        mongoose.connection.on("error", (err) => {
            logger.error('MongoDB error', { error: err.message });
        });

    } catch (error) {
        logger.error('Database connection failed', { error: error.message });
        process.exit(1);
    }
};

module.exports = connectDatabase;