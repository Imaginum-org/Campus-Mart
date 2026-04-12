import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { reportProductSchema } from "../validations/report.validation.js";
import { reportProduct } from "../controllers/report.controller.js";

const router = express.Router();

router.post(
  "/product/:productId",
  auth,
  validate(reportProductSchema),
  reportProduct,
);

export default router;
