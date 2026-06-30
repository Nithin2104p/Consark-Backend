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
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: false,
        },

        // Account status
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['Invited', 'Active', 'Inactive', 'Suspended'],
            default: 'Active',
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

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },

        location: {
            type: String,
            trim: true,
        },

        phoneNumber: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);



userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
userSchema.index({ companyId: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;