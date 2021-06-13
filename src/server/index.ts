import App from './App';
import config from 'config';

const app = new App();

function onUnhandledRejection(reason: Record<string, unknown> | null | undefined, p: Promise<any>): void {
    const tags = ['unhandled', 'rejection'];
    console.warn(`Unhandled Rejection at: Promise, ${p}, reason: ${reason}`, undefined, tags);
}

function onUncaughtException(err: Error): void {
    console.error(err.message, null, ['uncaught', 'exception'], { stack: err.stack });
    process.exit(1);
}

async function onSigterm(): Promise<void> {
    console.warn('Received sigterm, gracefully shutting down the server');

    try {
        await app.stop();
        console.warn('Server gracefully shut down, closing application');
        process.exit(0);
    } catch (e) {
        console.error('Error received when shutting down the server', {
            stack: e.stack,
        });
        process.exit(1);
    }
}

function startApp(): void {
    process.on('uncaughtException', onUncaughtException);
    process.on('unhandledRejection', onUnhandledRejection);
    process.on('SIGTERM', onSigterm);
    console.info('Starting application...');
    app.start(config.get<number>('port')).catch(onUncaughtException);
}

startApp();
