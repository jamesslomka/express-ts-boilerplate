// Can be used to check users

// import { NextFunction, Request, Response } from 'express';
// import { UserService } from '../service/UserService';
// import { User } from '../entities/User';
//
// export const checkRole = (roles: string[]) => {
//     return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//         // Get the user ID from previous middleware
//         const id = res.locals.jwtPayload.userId;
//
//         // Get user role from the database
//         let user: User;
//         try {
//             user = await UserService.getOneById(id);
//         } catch (id) {
//             res.status(403).send('Your role does not permit you do do this action');
//         }
//
//         // Check if array of authorized roles includes the user's role
//         roles.indexOf(user.role) > -1 ? next() : res.status(403).send();
//     };
// };
