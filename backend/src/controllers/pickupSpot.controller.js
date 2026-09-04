import mongoose from "mongoose";
import PickupSpot from "../models/PickupSpot.model.js";

const normalizeSpotInput = (body) => ({
  name: typeof body.name === "string" ? body.name.trim() : "",
  detail: typeof body.detail === "string" ? body.detail.trim() : "",
  isPrimary: Boolean(body.isPrimary),
});

export const createPickupSpot = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, detail, isPrimary } = normalizeSpotInput(req.body);

    if (!name || !detail) {
      return res.status(400).json({
        message: "Pickup spot name and detail are required",
        success: false,
        error: true,
      });
    }

    const count = await PickupSpot.countDocuments({ user: userId });
    if (count >= 3) {
      return res.status(400).json({
        message: "Maximum 3 pickup spots allowed",
        success: false,
        error: true,
      });
    }

    const exists = await PickupSpot.findOne({ user: userId, name, detail });
    if (exists) {
      return res.status(400).json({
        message: "This pickup spot already exists",
        success: false,
        error: true,
      });
    }

    const pickupSpot = await PickupSpot.create({
      user: userId,
      name,
      detail,
      isPrimary: isPrimary || count === 0,
    });

    return res.status(201).json({
      message: "Pickup spot created successfully",
      success: true,
      error: false,
      pickupSpot,
    });
  } catch (err) {
    console.error("createPickupSpot error:", err);
    return res.status(500).json({
      message: err.message || "Server error",
      success: false,
      error: true,
    });
  }
};

export const getUserPickupSpots = async (req, res) => {
  try {
    const pickupSpots = await PickupSpot.find({ user: req.userId })
      .sort({ isPrimary: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Pickup spots fetched successfully",
      success: true,
      error: false,
      pickupSpots,
    });
  } catch (err) {
    console.error("getUserPickupSpots error:", err);
    return res.status(500).json({
      message: err.message || "Server error",
      success: false,
      error: true,
    });
  }
};

export const updatePickupSpot = async (req, res) => {
  try {
    const { pickupSpotId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pickupSpotId)) {
      return res.status(400).json({
        message: "Invalid pickup spot ID",
        success: false,
        error: true,
      });
    }

    const pickupSpot = await PickupSpot.findOne({
      _id: pickupSpotId,
      user: req.userId,
    });

    if (!pickupSpot) {
      return res.status(404).json({
        message: "Pickup spot not found",
        success: false,
        error: true,
      });
    }

    if (req.body.name !== undefined) pickupSpot.name = req.body.name.trim();
    if (req.body.detail !== undefined) pickupSpot.detail = req.body.detail.trim();
    if (req.body.isPrimary !== undefined) {
      pickupSpot.isPrimary = Boolean(req.body.isPrimary);
    }

    await pickupSpot.save();

    return res.status(200).json({
      message: "Pickup spot updated successfully",
      success: true,
      error: false,
      pickupSpot,
    });
  } catch (err) {
    console.error("updatePickupSpot error:", err);
    return res.status(500).json({
      message: err.message || "Server error",
      success: false,
      error: true,
    });
  }
};

export const deletePickupSpot = async (req, res) => {
  try {
    const { pickupSpotId } = req.params;

    const pickupSpot = await PickupSpot.findOneAndDelete({
      _id: pickupSpotId,
      user: req.userId,
    });

    if (!pickupSpot) {
      return res.status(404).json({
        message: "Pickup spot not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Pickup spot deleted successfully",
      success: true,
      error: false,
      pickupSpot,
    });
  } catch (err) {
    console.error("deletePickupSpot error:", err);
    return res.status(500).json({
      message: err.message || "Server error",
      success: false,
      error: true,
    });
  }
};

export const setPrimaryPickupSpot = async (req, res) => {
  try {
    const { pickupSpotId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pickupSpotId)) {
      return res.status(400).json({
        message: "Invalid pickup spot ID",
        success: false,
        error: true,
      });
    }

    const pickupSpot = await PickupSpot.findOne({
      _id: pickupSpotId,
      user: req.userId,
    });

    if (!pickupSpot) {
      return res.status(404).json({
        message: "Pickup spot not found",
        success: false,
        error: true,
      });
    }

    await PickupSpot.updateMany(
      { user: req.userId },
      { $set: { isPrimary: false } },
    );

    pickupSpot.isPrimary = true;
    await pickupSpot.save();

    return res.status(200).json({
      message: "Primary pickup spot updated successfully",
      success: true,
      error: false,
      pickupSpot,
    });
  } catch (err) {
    console.error("setPrimaryPickupSpot error:", err);
    return res.status(500).json({
      message: err.message || "Server error",
      success: false,
      error: true,
    });
  }
};
