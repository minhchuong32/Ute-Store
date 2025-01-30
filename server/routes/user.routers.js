import { Router } from "express";
import { registerUserController, verifyEmailController, loginUserController, logoutUserController,uploadAvatarController } from "../controllers/user.controllers.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutUserController);
userRouter.put("/upload-avatar", auth, upload.single('avatar'), uploadAvatarController);

export default userRouter;
