import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../../config/default';

export const checkJwt = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.auth as string;
    let jwtPayload;

    try {
        jwtPayload = jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send('Invalid token');
        return;
    }

    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { userId, username, role } = jwtPayload;

    const newToken = jwt.sign({ userId, username, role }, config.jwtSecret, {
        expiresIn: '31 days',
    });
    res.setHeader('auth', newToken);
    res.setHeader('user', username);
    res.setHeader('userId', userId);
    next();
};
