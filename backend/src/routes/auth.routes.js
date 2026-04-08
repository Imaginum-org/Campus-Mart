import {Router} from "express";
import {registerUserController, loginController,verifyEmailController,logoutUser,forgotPasswordController} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register",registerUserController);
authRouter.post("/login",loginController);
authRouter.post("/verify-email",verifyEmailController);
authRouter.get("/logoutUser",logoutUser);
authRouter.get("/forgot-password",forgotPasswordController);

export default authRouter;                  
