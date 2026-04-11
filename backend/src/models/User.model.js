import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Please provide your password"],
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER", "SUPPORT"],
      default: "USER",
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },

    is_email_verified: {
      type: Boolean,
      default: false,
    },

    verifyTokenEmail: {
      type: String,
      select: false,
      default: "",
    },

    last_login_date: {
      type: Date,
      default: null,
    },

    address_details: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],

    subscription_details: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },

    refresh_token: {
      type: String,
      select: false,
    },

    forgot_password_otp: {
      type: String,
      select: false,
    },

    forgot_password_expiry: {
      type: Date,
      default: null,
    },

    current_lat: {
      type: Number,
      default: null,
    },

    current_long: {
      type: Number,
      default: null,
    },

    location_updated_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
