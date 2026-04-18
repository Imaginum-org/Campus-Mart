import { z } from "zod";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITION,
  PRODUCT_PAYMENT,
} from "../config/constants.js";

export const createProductSchema = z.object({
  title: z.string().min(3).max(120),

  description: z.string().min(10).max(2000),

  category: z.enum(Object.values(PRODUCT_CATEGORIES)),

  condition: z.enum(Object.values(PRODUCT_CONDITION)),

  selling_price: z.number().positive(),

  original_price: z.number().positive().optional(),

  is_negotiable: z.boolean().optional(),

  payment_preference: z.enum(Object.values(PRODUCT_PAYMENT)),

  images: z
    .array(z.string().url())
    .min(1, "At least one image required")
    .max(3, "Maximum 3 images allowed"),

  attributes: z
    .object({
      brand: z.string().optional(),
      color: z.string().optional(),
      usage_duration: z.string().optional(),
      purchase_date: z.string().optional(), // frontend will send string
    })
    .optional(),

  pickup_address_snapshot: z.object({
    address_line: z.string().min(3),
    city: z.string().min(2),
    state: z.string().optional(),
    pincode: z.string().optional(),
    mobile: z.string().optional(),
    additional_info: z.string().optional(),
  }),

  image_file_ids: z.array(z.string().min(1)).optional(),
  purchase_date: z.string().datetime().optional(),
});
