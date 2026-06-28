const Company = require('../models/company.model');
const AppError = require('../utils/appError');
const {
    buildQueryOptions,
    withActiveFilter,
    applyModifiers,
} = require('../utils/repositoryUtils');

const createOne = async (document, options = {}) => {
    try {
        const [created] = await Company.create([document], buildQueryOptions(options));
        return created;
    } catch (error) {
        throw new AppError(`createOne: ${error.message}`, 500);
    }
};

const findOne = async (filter = {}, options = {}) => {
    try {
        const query = Company.findOne(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(`findOne: ${error.message}`, 500);
    }
};

const findById = async (id, options = {}) => {
    try {
        const filter = { _id: id };

        if (!options.includeDeleted) {
            filter.deletedAt = null;
        }

        const query = Company.findOne(filter);

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(`findById: ${error.message}`, 500);
    }
};

module.exports = {
    createOne,
    findOne,
    findById,
};
