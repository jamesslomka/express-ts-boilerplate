// @ts-ignore
import * as app from '../package.json';

const config = {
    appName: app.name,
    appVersion: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: 80,
    userAgent: `${app.name}@${app.version}`,
    jwtSecret: process.env.NODE_ENV || 'ABC123',
};
export = { ...config, default: config };
