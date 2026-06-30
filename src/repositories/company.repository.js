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
        throw new AppError(error.message, 500, null, { source: 'createOne' });
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
        throw new AppError(error.message, 500, null, { source: 'findOne' });
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
        throw new AppError(error.message, 500, null, { source: 'findById' });
    }
};

const findMany = async (filter = {}, options = {}) => {
    try {
        const query = Company.find(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'findMany' });
    }
};

module.exports = {
    createOne,
    findOne,
    findById,
    findMany,
};
