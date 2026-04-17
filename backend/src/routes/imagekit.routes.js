import express from "express";
import { getAuthParams } from "../controllers/imagekit.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/auth", auth, getAuthParams);

export default router;
