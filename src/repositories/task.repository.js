const Task = require('../models/task.model');
const {
    buildQueryOptions,
    withActiveFilter,
    applyModifiers,
} = require('../utils/repositoryUtils');

const createOne = async (document, options = {}) => {
    return Task.create(document, buildQueryOptions(options));
};

const bulkCreate = async (documents, options = {}) => {
    return Task.insertMany(documents, {
        ordered: options.ordered !== false,
        ...buildQueryOptions(options),
    });
};

const findOne = async (filter = {}, options = {}) => {
    const query = Task.findOne(withActiveFilter(filter, options));

    if (options.session) {
        query.session(options.session);
    }

    return applyModifiers(query, options);
};

const findMany = async (filter = {}, options = {}) => {
    const query = Task.find(withActiveFilter(filter, options));

    if (options.session) {
        query.session(options.session);
    }

    return applyModifiers(query, options);
};

const findById = async (id, options = {}) => {
    const filter = { _id: id };

    if (!options.includeDeleted) {
        filter.deletedAt = null;
    }

    const query = Task.findOne(filter);

    if (options.session) {
        query.session(options.session);
    }

    return applyModifiers(query, options);
};

const updateOne = async (filter, updateData, options = {}) => {
    return Task.findOneAndUpdate(
        withActiveFilter(filter, options),
        updateData,
        {
            returnDocument: 'after',
            runValidators: true,
            setDefaultsOnInsert: true,
            ...buildQueryOptions(options),
            ...options.queryOptions,
        }
    );
};

const deleteOne = async (filter = {}, options = {}) => {
    return Task.deleteOne(withActiveFilter(filter, options), buildQueryOptions(options));
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