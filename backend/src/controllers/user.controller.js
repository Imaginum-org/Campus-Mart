import userModel from "../models/User.model.js";

export const getUserProfile = async (req, res) => {

    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                success: false,
                error: true,
            });
        }
        return res.status(200).json({
            message: "User Profile Fetched Successfully",
            success: true,
            error: false,
            user: user
        });
    }
    catch (err) {
        console.error("Error fetching in getUserProfile", err);
        return res.status(500).json({
            message: err.message || err,
            success: false,
            error: true
        });

    }

};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { mobile, gender } = req.body;

    const updateData = {};
    if (mobile !== undefined) updateData.mobile = mobile;
    if (gender !== undefined) updateData.gender = gender;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      error: false,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

export const deleteAccount = async (req, res) => {
    try {
        
        const userId = req.userId;
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found or already deleted",
                success: false,
                error: true
            });  
        }

        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
        };

        res.clearCookie("accessToken", cookieOptions)
           .status(200)
           .json({
               message: "Account deleted successfully",
               success: true,
               error: false
           });

    } catch (err) {
        console.error("Error in deleteAccount controller:", err);
        return res.status(500).json({
            message: err.message || "Server error while deleting account",
            success: false,
            error: true
        });
    }
};

