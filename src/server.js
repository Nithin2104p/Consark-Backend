const http = require('http');
const app = require('./app');
const connectDatabase = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDatabase();
        server.listen(env.port, () => {
            logger.info(`Server running on http://localhost:${env.port} in ${env.nodeEnv} mode`);
        });
    } catch (error) {
        logger.error('Server failed to start', { error: error.message });
        process.exit(1);
    }
};

startServer();
