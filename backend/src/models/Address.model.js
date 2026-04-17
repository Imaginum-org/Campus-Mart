import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for address"],
      index: true,
    },

    line1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
      maxlength: [200, "Address line 1 cannot exceed 200 characters"],
    },

    line2: {
      type: String,
      trim: true,
      maxlength: [200, "Address line 2 cannot exceed 200 characters"],
      default: "",
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [100, "State name cannot exceed 100 characters"],
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      validate: {
        validator: function(v) {
          return /^\d{6}$/.test(v);
        },
        message: "Pincode must be exactly 6 digits"
      }
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


addressSchema.index({ user: 1, isDefault: 1 });

addressSchema.pre("save", async function () {
  if (this.isDefault) {
  
    await mongoose.model("Address").updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
});

const Address = mongoose.model("Address", addressSchema);

export default Address;