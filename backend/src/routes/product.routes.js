import express from "express";
import { createProductSchema } from "../validations/product.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit"

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

const createProductLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many product listings, please try later",
});

router.post(
  "/",
  createProductLimiter,
  auth,
  validate(createProductSchema),
  createProduct,
);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

export default router;
