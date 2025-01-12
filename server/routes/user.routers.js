import { Router } from "express";
import { registerUserController, verifyEmailController, loginUserController } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);

export default userRouter;
