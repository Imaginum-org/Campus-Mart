import cookie from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/User.model.js";
import sendEmail from "../config/sendEmail.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import verifyEmailTempplate from "../utils/templates/verifyEmailTemplate.js";
import { generateOtp } from "../utils/generateOtp.js";
import forgotPaswordTemplate from "../utils/templates/forgotPaswordTemplate.js";

export const registerUserController = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide name, email and password",
        error: true,
        success: false,
      });
    }

    email = email.trim().toLowerCase();

    const existingUser = await userModel.findOne({ email });

    if (existingUser && existingUser.is_email_verified) {
      return res.status(400).json({
        message: "User already registered. Please log in.",
        error: true,
        success: false,
      });
    }
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${verifyToken}`;

    let responseMessage = "";
    let statusCode = 201;

    if (existingUser) {
      await userModel.findByIdAndUpdate(existingUser._id, {
        verifyTokenEmail: verifyToken,
        password: newHashedPassword,
      });

      responseMessage =
        "Account exists but is unverified. We just resent your verification email!";
      statusCode = 200;
    } else {
      const hashpassword = await bcrypt.hash(password, 10);

      await userModel.create({
        name,
        email,
        password: hashpassword,
        verifyTokenEmail: verifyToken,
        is_email_verified: false,
      });

      responseMessage =
        "User registered successfully. Please check your email.";
      statusCode = 201;
    }

    await sendEmail({
      sendTo: email,
      subject: "Verify your email for Campus Mart",
      html: verifyEmailTempplate({
        name: existingUser ? existingUser.name : name,
        url: verifyEmailUrl,
      }),
    });

    return res.status(statusCode).json({
      message: responseMessage,
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "User with this email does not exist.",
        success: false,
        error: true,
      });
    }

    if (!user.is_email_verified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in.",
        success: false,
        error: true,
      });
    }
    if (user.status && user.status !== "Active") {
      return res.status(403).json({
        message: "Account is inactive or suspended.",
        success: false,
        error: true,
      });
    }

    const checkpassword = await bcrypt.compare(password, user.password);
    if (!checkpassword) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
        error: true,
      });
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";

    const baseCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    };

    const accessTokenOptions = {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000,
    };

    const refreshMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 1 * 24 * 60 * 60 * 1000;
    const refreshTokenOptions = {
      ...baseCookieOptions,
      maxAge: refreshMaxAge,
    };

    res.cookie("accessToken", accesstoken, accessTokenOptions);
    res.cookie("refreshToken", refreshtoken, refreshTokenOptions);

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      error: false,
      data: { refreshtoken, accesstoken },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        message: "verification code required ",
        success: false,
        error: true,
      });
    }
    const user = await userModel.findOne({
      verifyTokenEmail: code,
    });
    if (!user) {
      return res.status(400).json({
        message: " Invalid or expired verification link",
        success: false,
        error: true,
      });
    }

    user.is_email_verified = true;
    user.verifyTokenEmail = "";
    await user.save();

    return res.status(200).json({
      message: "Verified email",
      success: true,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      success: true,
      error: false,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    };

    res.clearCookie("accessToken", cookieOptions).status(200).json({
      success: true,
      message: "Logged out successfully",
      error: false,
    });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: true,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User with this email doesn't exist",
        success: false,
        error: true,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expireTime = Date.now() + 15 * 60 * 1000;
    await userModel.findByIdAndUpdate(user._id, {
      reset_password_token: resetToken,
      reset_password_expiry: expireTime,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 5. Send the email
    await sendEmail({
      sendTo: email,
      subject: "Reset your Campus Mart password",
      html: forgotPaswordTemplate({
        user: user.name,
        resetUrl: resetUrl, // Pass the URL instead of the OTP
      }),
    });

    return res.status(200).json({
      message:
        "Password reset link sent to your email. Please check your inbox.",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "An error occurred while sending the reset email",
      success: false,
      error: true,
    });
  }
};

/* export const verifyforgotPasswordOtpController = async (req, res) => {
    try{
        const { email,otp } = req.body ;
        if(!email || !otp ){
            return res.status(400).json({
                message : "Please Provide Email and Otp ",
                success : false ,
                error : true 
            })
        } 

        const  user = await userModel.findOne({email}).select("+forgot_password_otp");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true 
            });
        }

        const currentTime = Date.now();
        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message : "Otp is expired",
                success : false,
                error : true 
            })
        }

        if(otp!==user.forgot_password_otp){
            return res.status(400).json({
                message : "Invalid Otp ",
                success : false ,
                error :true 
            })
        }

        return res.status(200).json({
            message : "Otp Verified",
            success :true ,
            error : false 
        })
    }
    catch(error){
        return res.status(500).json({
            message : error.message || error ,
            success : false ,
            error : true
        })
    }
     
} */

export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Please provide a new password",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({
      reset_password_token: token,
      reset_password_expiry: { $gt: Date.now() }, // $gt means "greater than" right now
    });

    if (!user) {
      return res.status(400).json({
        message: "This password reset link is invalid or has expired.",
        success: false,
        error: true,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      reset_password_token: "",
      reset_password_expiry: null,
    });

    return res.status(200).json({
      message: "Password updated successfully!",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "An error occurred while resetting the password",
      success: false,
      error: true,
    });
  }
};
export const verifyResetTokenPreCheck = async (req, res) => {
  try {
    const { token } = req.params;

    // Check if the token exists and hasn't expired yet
    const user = await userModel.findOne({
      reset_password_token: token,
      reset_password_expiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "This password reset link is invalid or has expired.",
        success: false,
        error: true,
      });
    }

    // If user is found, the token is perfectly valid!
    return res.status(200).json({
      message: "Token is valid",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while verifying link",
      success: false,
      error: true,
    });
  }
};
