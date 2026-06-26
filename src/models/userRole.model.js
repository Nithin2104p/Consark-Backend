const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
        assignedAt: { type: Date, default: Date.now },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

userRoleSchema.index({ user: 1, role: 1, deletedAt: 1 }, { unique: true });

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;