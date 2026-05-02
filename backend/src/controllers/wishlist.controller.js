import User from "../models/User.model.js";
import Product from "../models/Product.model.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is already in wishlist
    const isAlreadyInWishlist = user.wishlist.includes(productId);
    if (isAlreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString(),
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "wishlist",
        model: "Product",
        select:
          "_id title images category selling_price original_price seller_id",
      })
      .select("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved",
      data: user.wishlist || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Check if product is in wishlist
export const isInWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isInWishlist = user.wishlist.includes(productId);

    return res.status(200).json({
      success: true,
      data: {
        isInWishlist,
      },
    });
  } catch (error) {
    console.error("Check wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Toggle wishlist (add if not present, remove if present)
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const isAlreadyInWishlist = user.wishlist.includes(productId);

    if (isAlreadyInWishlist) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString(),
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isAlreadyInWishlist
        ? "Product removed from wishlist"
        : "Product added to wishlist",
      data: {
        isInWishlist: !isAlreadyInWishlist,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
