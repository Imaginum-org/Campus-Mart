import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

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

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: ["electronics", "books", "furniture", "stationery", "others"],
      required: true,
      index: true,
    },

    condition: {
      type: String,
      enum: ["new", "like_new", "used"],
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
      default: false,
    },

    payment_preference: {
      type: String,
      enum: ["cash", "upi", "both"],
      required: true,
    },

    pickup_address_snapshot: {
      address_line: String,
      city: String,
      state: String,
      pincode: String,
      mobile: String,
      additional_info: String,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        validate: {
          validator: (val) => val.length === 2,
          message: "Coordinates must be [lng, lat]",
        },
      },
    },

    status: {
      type: String,
      enum: ["LISTED", "SOLD", "UNLISTED", "BLOCKED"],
      default: "LISTED",
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
  }
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1, selling_price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ location: "2dsphere" });

productSchema.pre("save", function (next) {
  if (!this.slug) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });

    this.slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  if (this.original_price && this.selling_price > this.original_price) {
    return next(
      new Error("Selling price cannot be greater than original price")
    );
  }

  next();
});

productSchema.methods.incrementViews = async function () {
  this.views_count += 1;
  return this.save();
};

productSchema.statics.findActiveProducts = function (filter = {}) {
  return this.find({
    ...filter,
    is_deleted: false,
    status: "LISTED",
  });
};

const Product = mongoose.model("Product", productSchema);

export default Product;
