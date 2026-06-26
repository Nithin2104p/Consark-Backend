const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Basic user details
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        // Account status
        isActive: {
            type: Boolean,
            default: true,
        },

        // Authentication related
        lastLoginAt: {
            type: Date,
        },

        // System fields
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);



const User = mongoose.model("User", userSchema);

module.exports = User;