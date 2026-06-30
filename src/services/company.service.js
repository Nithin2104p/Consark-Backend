const companyRepository = require('../repositories/company.repository');
const AppError = require('../utils/appError');

const createCompany = async (companyName, options = {}) => {
    try {
        if (!companyName || typeof companyName !== 'string') {
            throw new AppError('Company name is required', 400, null, { source: 'createCompany' });
        }
        const company = await companyRepository.createOne({ name: companyName }, options);
        return company;
    } catch (error) {
        if (error instanceof AppError) {
            error.datapoints = error.datapoints || { source: 'createCompany' };
            throw error;
        }
        throw new AppError(error.message, error.statusCode || 500, null, { source: 'createCompany' });
    }
};

module.exports = {
    createCompany,
};
