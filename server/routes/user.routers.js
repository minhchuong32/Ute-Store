import { Router } from 'express';
import { registerUserController } from '../controllers/user.controllers.js';

const userRouter = Router();

userRouter.post('/register', registerUserController)


export default userRouter;