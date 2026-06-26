const mongoose = require("mongoose");
const env = require("./env");

const connectDatabase = async () => {
    try {
        // console.log("MongoDB connection URI:", env.mongoUri); // Log the connection URI for debugging
        await mongoose.connect(env.mongoUri);

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB error:", err);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;