const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        label: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
