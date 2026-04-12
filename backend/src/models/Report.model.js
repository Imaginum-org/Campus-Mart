import mongoose, { Schema } from "mongoose";
import { REPORT_REASONS } from "../config/constants.js";

const reportSchema = new Schema(
  {
    reporter_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: Object.values(REPORT_REASONS),
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Prevent duplicate reports by same user on same product
reportSchema.index({ reporter_id: 1, product_id: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

export default Report;
