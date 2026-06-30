const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
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

companySchema.index({ name: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
