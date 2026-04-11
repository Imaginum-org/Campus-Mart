import {Router} from "express";
import {registerUserController, loginController,verifyEmailController,logoutUser,forgotPasswordController,resetPasswordController,verifyResetTokenPreCheck,resendVerificationController} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register",registerUserController);
authRouter.post("/login",loginController);
authRouter.post("/verify-email",verifyEmailController);
authRouter.get("/logoutUser",logoutUser);
authRouter.post("/forgot-password",forgotPasswordController);
authRouter.get("/reset-password/:token", verifyResetTokenPreCheck);
authRouter.post("/reset-password/:token", resetPasswordController);
authRouter.post('/resend-verification', resendVerificationController);
export default authRouter; 