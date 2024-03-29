//import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { Router } from 'express';
import TestSample from './TestSample.controller';
import User from './User.controller';

// User-route
/*
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);
*/

// Export the base-router
const baseRouter = Router();

baseRouter.use('/testSample',TestSample );
baseRouter.use('/user',User );

export default baseRouter;
