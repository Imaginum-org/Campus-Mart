import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const auth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("ACCESS VERIFY:", token);
    if (!token) {
      return res.status(401).json({
        message: "Access token required",
        success: false,
        error: true,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    req.userId = decode.id;
    // Fetching user
    const user = await User.findById(decode.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    // Attaching full user
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
      error: true,
    });
  }
};

export default auth;
