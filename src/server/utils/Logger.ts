import pino from 'pino';

const logger = pino({
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development',
    redact: [],
});

export { logger };
