import cookie from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/User.model.js";
import sendEmail from "../config/sendEmail.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import verifyEmailTempplate from "../utils/templates/verifyEmailTemplate.js";
import { generateOtp } from "../utils/generateOtp.js";
import forgotPaswordTemplate from "../utils/templates/forgotPaswordTemplate.js";
import { USER_STATUS } from "../config/constants.js";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const setAuthCookies = (res, accessToken, refreshToken) => {
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

  const refreshTokenOptions = {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
};

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
      const newHashedPassword = await bcrypt.hash(password, 10);

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
    const { email, password } = req.body;

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
        requiresVerification: true,
      });
    }
    if (user.status && user.status !== USER_STATUS.ACTIVE) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
        error: true,
      });
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);

    setAuthCookies(res, accesstoken, refreshtoken);

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

export const googleAuthRedirectController = async (req, res) => {
  try {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    });

    return res.redirect(authorizeUrl);
  } catch (error) {
    console.error("Google auth redirect error:", error);
    return res.status(500).json({
      message: "Unable to start Google authentication",
      success: false,
      error: true,
    });
  }
};

export const googleAuthCallbackController = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        message: "Google authorization code is missing.",
        success: false,
        error: true,
      });
    }

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens?.id_token) {
      return res.status(400).json({
        message: "Unable to verify Google identity.",
        success: false,
        error: true,
      });
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Google did not return a valid email.",
        success: false,
        error: true,
      });
    }

    const name = payload.name || email.split("@")[0];
    const picture = payload.picture;

    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        avatar: picture || undefined,
        is_email_verified: true,
        verifyTokenEmail: "",
      });
    } else if (picture && user.avatar !== picture) {
      user.avatar = picture;
      await user.save();
    }

    if (!user.is_email_verified) {
      user.is_email_verified = true;
      await user.save();
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);

    setAuthCookies(res, accesstoken, refreshtoken, true);
    return res.redirect(`${process.env.FRONTEND_URL}/login?oauth=success`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res.status(500).json({
      message: "Google authentication failed.",
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
      success: false,
      error: true,
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

export const refreshAccessTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
        success: false,
        error: true,
      });
    }

    const decode = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    const user = await userModel.findById(decode.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        success: false,
        error: true,
      });
    }

    const newAccessToken = await generatedAccessToken(user._id);
    const newRefreshToken = await generatedRefreshToken(user._id);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
      error: false,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid refresh token",
      success: false,
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

export const resendVerificationController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false, error: true });
    }

    if (user.is_email_verified) {
      return res
        .status(400)
        .json({
          message: "Email is already verified. Please log in.",
          success: false,
          error: true,
        });
    }

    // Generate a new token and update the user
    const verifyToken = crypto.randomBytes(32).toString("hex");
    await userModel.findByIdAndUpdate(user._id, {
      verifyTokenEmail: verifyToken,
    });

    // Send the email
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${verifyToken}`;
    await sendEmail({
      sendTo: email,
      subject: "Verify your email for Campus Mart",
      html: verifyEmailTempplate({ name: user.name, url: verifyEmailUrl }),
    });

    return res
      .status(200)
      .json({
        message: "Verification email resent!",
        success: true,
        error: false,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};
