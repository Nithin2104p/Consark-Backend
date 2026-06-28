const RolePermission = require('../models/rolePermission.model');
const AppError = require('../utils/appError');
const {
    withActiveFilter,
    applyPopulate,
} = require('../utils/repositoryUtils');

const findByRole = async (roleId, options = {}) => {
    try {
        const filter = withActiveFilter({ role: roleId }, options);
        let query = RolePermission.find(filter);

        if (options.session) {
            query = query.session(options.session);
        }

        query = applyPopulate(query, 'permission');

        const docs = await query;
        return docs;
    } catch (error) {
        throw new AppError(`findByRole: ${error.message}`, error.statusCode || 500);
    }
};

module.exports = {
    findByRole,
};
