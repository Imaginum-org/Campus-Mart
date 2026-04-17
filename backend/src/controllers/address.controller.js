import Address from "../models/Address.model.js";

// Create a new address
export const createAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { line1, line2, city, state, pincode, isDefault } = req.body;

    // Validate required fields
    if (!line1 || !city || !state || !pincode) {
      return res.status(400).json({
        message: "Required fields: line1, city, state, pincode",
        success: false,
        error: true,
      });
    }

    // Create address
    const address = new Address({
      user: userId,
      line1,
      line2: line2 || "",
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    await address.save();

    return res.status(201).json({
      message: "Address created successfully",
      success: true,
      error: false,
      address,
    });
  } catch (err) {
    console.error("Error in createAddress:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.userId;

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Addresses fetched successfully",
      success: true,
      error: false,
      addresses,
    });
  } catch (err) {
    console.error("Error in getUserAddresses:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// Get a specific address by ID
export const getAddressById = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Address fetched successfully",
      success: true,
      error: false,
      address,
    });
  } catch (err) {
    console.error("Error in getAddressById:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;
    const { line1, line2, city, state, pincode, isDefault } = req.body;

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

    // Update fields
    if (line1 !== undefined) address.line1 = line1;
    if (line2 !== undefined) address.line2 = line2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return res.status(200).json({
      message: "Address updated successfully",
      success: true,
      error: false,
      address,
    });
  } catch (err) {
    console.error("Error in updateAddress:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Address deleted successfully",
      success: true,
      error: false,
      address,
    });
  } catch (err) {
    console.error("Error in deleteAddress:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    // First, unset all default addresses for this user
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    // Set the specified address as default
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Default address set successfully",
      success: true,
      error: false,
      address,
    });
  } catch (err) {
    console.error("Error in setDefaultAddress:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};