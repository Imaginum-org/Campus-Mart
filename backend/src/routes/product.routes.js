import express from "express";
import { createProductSchema } from "../validations/product.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", auth, validate(createProductSchema), createProduct);

export default router;
