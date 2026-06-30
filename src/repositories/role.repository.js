const Role = require('../models/role.model');
const AppError = require('../utils/appError');
const {
    buildQueryOptions,
    withActiveFilter,
    applyModifiers,
} = require('../utils/repositoryUtils');

const createOne = async (document, options = {}) => {
    try {
        return Role.create(document, buildQueryOptions(options));
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'createOne' });
    }
};

const bulkCreate = async (documents, options = {}) => {
    try {
        return Role.insertMany(documents, {
            ordered: options.ordered !== false,
            ...buildQueryOptions(options),
        });
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'bulkCreate' });
    }
};

const findOne = async (filter = {}, options = {}) => {
    try {
        const query = Role.findOne(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'findOne' });
    }
};

const findAll = async (filter = {}, options = {}) => {
    try {
        const query = Role.find(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'findAll' });
    }
};

const findMany = async (filter = {}, options = {}) => {
    try {
        const query = Role.find(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'findMany' });
    }
};

const findById = async (id, options = {}) => {
    try {
        const filter = { _id: id };

        if (!options.includeDeleted) {
            filter.deletedAt = null;
        }

        const query = Role.findOne(filter);

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'findById' });
    }
};

const updateOne = async (filter, updateData, options = {}) => {
    try {
        return Role.findOneAndUpdate(
            withActiveFilter(filter, options),
            updateData,
            {
                returnDocument: 'after',
                runValidators: true,
                setDefaultsOnInsert: true,
                ...buildQueryOptions(options),
                ...(options.queryOptions || {}),
            }
        );
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'updateOne' });
    }
};

const deleteOne = async (filter = {}, options = {}) => {
    try {
        return Role.deleteOne(withActiveFilter(filter, options), buildQueryOptions(options));
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'deleteOne' });
    }
};

module.exports = {
    createOne,
    bulkCreate,
    findOne,
    findMany,
    findById,
    updateOne,
    deleteOne,
};