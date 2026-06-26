const buildQueryOptions = (options = {}) => {
    const queryOptions = {};

    if (options.session) {
        queryOptions.session = options.session;
    }

    return queryOptions;
};

const withActiveFilter = (filter = {}, options = {}) => {
    if (options.includeDeleted) {
        return filter;
    }

    return { ...filter, deletedAt: null };
};

const applyPopulate = (query, populate) => {
    if (!populate) {
        return query;
    }

    return Array.isArray(populate)
        ? populate.reduce((currentQuery, populateOption) => currentQuery.populate(populateOption), query)
        : query.populate(populate);
};

const applyProjection = (query, select) => {
    if (!select) {
        return query;
    }

    return query.select(select);
};

const applyPagination = (query, options = {}) => {
    if (options.sort) {
        query.sort(options.sort);
    }

    if (typeof options.skip === 'number') {
        query.skip(options.skip);
    }

    if (typeof options.limit === 'number') {
        query.limit(options.limit);
    }

    return query;
};

const applyModifiers = (query, options = {}) => {
    query = applyProjection(query, options.select);
    query = applyPopulate(query, options.populate);
    query = applyPagination(query, options);

    return query;
};

module.exports = {
    buildQueryOptions,
    withActiveFilter,
    applyPopulate,
    applyProjection,
    applyPagination,
    applyModifiers,
};
