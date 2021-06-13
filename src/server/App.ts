import 'dotenv/config';
import routes from './routes';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import expressPino from 'pino-http';
import correlator from 'express-correlation-id';
import { Server } from 'http';
import { NextFunction, Request, Response } from 'express';
import { logger } from './utils/Logger';
import config from 'config';

export default class App {
    private app: express.Application;
    private server: Server;
    constructor() {
        this.app = express();
        this.initializeMiddleware();
        this.routes();
    }
    public start(port: number): Promise<App> {
        return new Promise<App>(async (resolve, reject) => {
            this.server = this.app.listen(port, () => {
                try {
                    console.log('App is running at http://localhost:%d', port);
                    return resolve(this);
                } catch (e) {
                    return reject(e);
                }
            });
        });
    }
    public stop(): Promise<void> {
        if (this.app) {
            return new Promise<void>((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await this.safeShutdown();
                        return resolve();
                    } catch (e) {
                        return reject(e);
                    }
                }, 3000);
            });
        } else {
            return Promise.resolve();
        }
    }

    private logging(): void {
        if (process.env.NODE_ENV === 'development') {
            const logRequestStart = (req: Request, res: Response, next: NextFunction) => {
                console.info(`${req.method} ${req.originalUrl}`);
                console.info(`${res.statusCode}\n`);
                next();
            };
            this.app.use(logRequestStart);
        }

        if (process.env.NODE_ENV !== 'development' && process.env.IS_LOGGING_ENABLED === 'true') {
            // pino
            const expressLogger = expressPino({ logger });
            this.app.use(expressLogger);
        }
    }

    private initializeMiddleware(): void {
        // express things
        this.app.disable('etag');
        this.app.set('json spaces', 4);

        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(correlator());
    }

    private routes(): void {
        this.app.use(
            express.static(path.join(__dirname, '../src/client/dist/'), {
                etag: false,
            }),
        );
        this.logging();

        this.app.get('/', (req, res) =>
            res.send({
                appId: config.get<string>('appName'),
                appVersion: config.get<string>('appVersion'),
                upTime: process.uptime(),
                environment: config.get<string>('env'),
                nodeVersion: process.version,
                platform: process.platform,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
            }),
        );

        // Route all routes with /api to backend
        this.app.use('/api', routes);

        // Serve everything else from the frontend
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../src/client/dist/index.html'));
        });
    }

    public async safeShutdown(): Promise<void> {
        await this.server.close();
    }
}
