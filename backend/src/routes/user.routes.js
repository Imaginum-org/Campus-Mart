import {Router} from "express";
import auth from "../middlewares/auth.middleware.js"
import { 
getUserProfile, 
updateUserProfile,
deleteAccount 
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/userProfile",auth,getUserProfile);
userRouter.put("/updateProfile",auth,updateUserProfile);
userRouter.delete("/deleteAccount",auth,deleteAccount);

export default userRouter;


