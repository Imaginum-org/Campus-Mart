import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";

import {
  PRODUCT_STATUS,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITION,
  PRODUCT_PAYMENT,
} from "../config/constants.js";

const productSchema = new Schema(
  {
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    // SEO-friendly URL
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORIES),
      required: true,
      index: true,
    },

    condition: {
      type: String,
      enum: Object.values(PRODUCT_CONDITION),
      required: true,
    },

    attributes: {
      brand: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      color: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      usage_duration: {
        type: String,
        trim: true,
      },
      purchase_date: {
        type: Date,
      },
    },

    images: {
      type: [
        {
          type: String,
          validate: {
            validator: (url) => /^https?:\/\/.+/.test(url),
            message: "Invalid image URL",
          },
        },
      ],
      required: true,
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: "At least one image is required",
        },
        {
          validator: (arr) => arr.length <= 3,
          message: "Maximum 3 images allowed",
        },
      ],
    },

    original_price: {
      type: Number,
      min: 0,
    },

    selling_price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    is_negotiable: {
      type: Boolean,
      default: true,
    },

    payment_preference: {
      type: String,
      enum: Object.values(PRODUCT_PAYMENT),
      required: true,
    },

    pickup_address_snapshot: {
      address_line: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      pincode: { type: String, trim: true, required: true },
      mobile: { type: String, trim: true },
      additional_info: { type: String, trim: true },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (val) {
            // Allow undefined OR valid array of 2 numbers
            return (
              val === undefined || (Array.isArray(val) && val.length === 2)
            );
          },
          message: "Coordinates must be [lng, lat]",
        },
      },
    },

    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.LISTED,
      index: true,
    },

    is_boosted: {
      type: Boolean,
      default: false,
    },

    boost_expires_at: {
      type: Date,
    },

    views_count: {
      type: Number,
      default: 0,
    },

    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1, selling_price: 1 });
productSchema.index({ seller_id: 1, createdAt: -1 });
productSchema.index(
  { seller_id: 1, title: 1, selling_price: 1 },
  { unique: false },
);
/*
For Nearby products and Nearby products
$near can be accessed
*/
productSchema.index({ location: "2dsphere" });

productSchema.pre("save", async function () {
  try {
    // Generate slug
    if (!this.slug) {
      const baseSlug = slugify(this.title, {
        lower: true,
        strict: true,
      });

      this.slug = `${baseSlug}-${nanoid(6)}`;
    }

    // Price validation
    if (this.original_price && this.selling_price > this.original_price) {
      throw new Error("Selling price cannot be greater than original price");
    }
  } catch (error) {
    throw error;
  }
});

// Increment views
productSchema.statics.getProductAndIncrementViews = function (productId) {
  return this.findByIdAndUpdate(
    productId,
    { $inc: { views_count: 1 } },
    { new: true },
  );
};

// Get active products
productSchema.statics.findActiveProducts = function (filter = {}) {
  return this.find({
    ...filter,
    is_deleted: false,
    status: PRODUCT_STATUS.LISTED,
  });
};

const Product = mongoose.model("Product", productSchema);

export default Product;
