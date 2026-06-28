const companyRepository = require('../repositories/company.repository');
const AppError = require('../utils/appError');

const createCompany = async (companyName) => {
    try {
        if (!companyName || typeof companyName !== 'string') {
            throw new AppError(`createCompany: companyName is required but received: ${JSON.stringify(companyName)}`, 400);
        }
        const company = await companyRepository.createOne({ name: companyName });
        return company;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(`createCompany: ${error.message}`, error.statusCode || 500);
    }
};

module.exports = {
    createCompany,
};
