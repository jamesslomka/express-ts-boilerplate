import routes from './routes';
import 'dotenv/config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as path from 'path';
import * as expressPino from 'pino-http';
import * as correlator from 'express-correlation-id';
import { Server } from 'http';
import { NextFunction, Request, Response } from 'express';
import { logger } from './utils/Logger';

export default class App {
    public app: express.Application;
    public server: Server;

    constructor() {
        this.app = express();
        this.config();
        this.initializeMiddleware();
        this.routes();
    }

    public config(): void {
        this.app.set('port', process.env.PORT || 5000);

        // express things
        this.app.disable('etag');
        this.app.set('json spaces', 4);
    }

    public logging(): void {
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

    public initializeMiddleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(correlator());
    }

    // public async connectDatabase(): Promise<void> {
    //     try {
    //         await connectMongo();
    //     } catch (error) {
    //         logger.error(error);
    //     }
    // }

    public routes(): void {
        this.app.use(
            express.static(path.join(__dirname, '../src/client/dist/'), {
                etag: false,
            }),
        );
        this.logging();

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

    public start(): Promise<App> {
        return new Promise<App>(async (resolve, reject) => {
            this.server = this.app.listen(this.app.get('port'), () => {
                try {
                    console.log(process.env.NODE_ENV);
                    console.log('App is running at http://localhost:%d', this.app.get('port'));
                    return resolve(this);
                } catch (e) {
                    return reject(e);
                }
            });
        });
    }
}
