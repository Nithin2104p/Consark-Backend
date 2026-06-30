const User = require('../models/user.model');
const AppError = require('../utils/appError');
const {
    buildQueryOptions,
    withActiveFilter,
    applyModifiers,
} = require('../utils/repositoryUtils');

const createOne = async (document, options = {}) => {
    try {
        const [created] = await User.create([document], buildQueryOptions(options));
        return created;
    } catch (error) {
        const appError = new AppError(error.message, error.statusCode || 500);
        appError.code = error.code;
        appError.keyPattern = error.keyPattern || error.keyValue;
        throw appError;
    }
};

const bulkCreate = async (documents, options = {}) => {
    try {
        return User.insertMany(documents, {
            ordered: options.ordered !== false,
            ...buildQueryOptions(options),
        });
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'bulkCreate' });
    }
};

const findOne = async (filter = {}, options = {}) => {
    try {
        const query = User.findOne(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'findOne' });
    }
};

const findMany = async (filter = {}, options = {}) => {
    try {
        const query = User.find(withActiveFilter(filter, options));

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

        const query = User.findOne(filter);

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
        return User.findOneAndUpdate(
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
        return User.findOneAndUpdate(
            withActiveFilter(filter, options),
            { deletedAt: new Date() },
            {
                returnDocument: 'after',
                ...buildQueryOptions(options),
            }
        );
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'deleteOne' });
    }
};

const countDocuments = async (filter = {}, options = {}) => {
    try {
        const query = User.countDocuments(withActiveFilter(filter, options));

        if (options.session) {
            query.session(options.session);
        }

        return applyModifiers(query, options);
    } catch (error) {
        throw new AppError(error.message, 500, null, { source: 'countDocuments' });
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
    countDocuments,
};