const winston = require('winston');
const env = require('../config/env');

const logger = winston.createLogger({
    level: env.nodeEnv === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.colorize({ all: true }),
        }),
    ],
});

if (env.nodeEnv === 'production') {
    logger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        })
    );
    logger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
        })
    );
}

module.exports = logger;
