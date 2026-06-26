const http = require('http');
const app = require('./app');
const connectDatabase = require('./config/db');
const env = require('./config/env');

const server = http.createServer(app);

const startServer = async () => {
    await connectDatabase();

    server.listen(env.port, () => {
        console.log(`Server running on http://localhost:${env.port}`);
    });
};

startServer().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});
