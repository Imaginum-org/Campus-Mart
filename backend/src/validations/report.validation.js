import { z } from "zod";
import { REPORT_REASONS } from "../config/constants.js";

export const reportProductSchema = z.object({
  reason: z.enum(Object.values(REPORT_REASONS)),
  message: z.string().max(500).optional(),
});
