import express from "express";
import { createProductSchema } from "../validations/product.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getBoostedProducts,
  getSearchSuggestions,
  searchProducts, 
} from "../controllers/product.controller.js";

const router = express.Router();

// RATE LIMIT
const createProductLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many product listings, please try later",
});


// Boosted products (must be before :id)
router.get("/boosted", getBoostedProducts);
router.get("/search", searchProducts);
router.get("/search-suggestions", getSearchSuggestions);

router.get("/", getAllProducts);

router.post(
  "/",
  createProductLimiter,
  auth,
  validate(createProductSchema),
  createProduct,
);

router.get("/:id", getSingleProduct);

export default router;
