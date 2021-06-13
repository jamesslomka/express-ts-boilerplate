import { Router } from 'express';
import auth from './AuthenticationRoute';
import user from './UserRoute';
const index = Router();

index.use('/auth', auth);
index.use('/user', user);

// endpoint to flush cache without rolling update
// index.post('/clear-cache')

export default index;
