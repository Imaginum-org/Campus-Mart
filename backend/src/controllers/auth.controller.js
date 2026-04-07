import cookie from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/User.model.js";
import sendEmail from "../config/sendEmail.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import verifyEmailTempplate from "../utils/templates/verifyEmailTemplate.js";

export const registerUserController = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Provide name, email and password",
                error: true,
                success: false
            });
        }
       
    
        email = email.trim().toLowerCase();

        const existingUser = await userModel.findOne({ email });
        
        if (existingUser) {
            if (existingUser.is_email_verified) {
                return res.status(400).json({
                    message: "User already registered. Please log in.",
                    error: true,
                    success: false
                });
            } else {
                const verifyToken = crypto.randomBytes(32).toString("hex");
            
                existingUser.verifyTokenEmail = verifyToken;
                await existingUser.save();

                const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${verifyToken}`;
                
                await sendEmail({
                    sendTo: email,
                    subject: "Verify your email for Campus Mart",
                    html: verifyEmailTempplate({ name: existingUser.name, url: verifyEmailUrl })
                });

                return res.status(200).json({
                    message: "Account exists but is unverified. We just resent your verification email!",
                    error: false,
                    success: true
                });
            }
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomBytes(32).toString("hex");

        const newUser = await userModel.create({
            name,
            email,
            password: hashpassword,
            verifyTokenEmail: verifyToken,
            is_email_verified: false 
        });

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${verifyToken}`;
        
        await sendEmail({
            sendTo: email,
            subject: "Verify your email for Campus Mart",
            html: verifyEmailTempplate({ name, url: verifyEmailUrl })
        });

        return res.status(201).json({
            message: "User registered successfully. Please check your email.",
            error: false,
            success: true,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
                success: false,
                error: true
            });
        }

        const user = await userModel.findOne({ email }).select("+password");
        
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password", 
                success: false,
                error: true
            });
        }

        if (!user.is_email_verified && user.status !== "Active") {
            return res.status(403).json({
                message: "Please verify your email address to activate your account.",
                success: false,
                error: true
            });
        }

        const checkpassword = await bcrypt.compare(password, user.password);

        if (!checkpassword) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
                error: true
            });
        }

        const accesstoken = await generatedAccessToken(user._id);
        const refreshtoken = await generatedRefreshToken(user._id);
        const isProduction = process.env.NODE_ENV === "production";
        const cookieoption = {
             httpOnly: true, 
            secure: isProduction, 
            sameSite: isProduction?"None":"Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
        };

        res.cookie('accessToken', accesstoken, cookieoption);
        res.cookie('refreshToken', refreshtoken, cookieoption);
        
        return res.status(200).json({
            message: "Login successfully",
            success: true,
            error: false,
            data: {
                refreshtoken,
                accesstoken
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            success: false,
            error: true
        });
    }
}

export const verifyEmailController =async (req,res) =>{
    try{
     const {code} = req.body;
     if(!code){
        return res.status(400).json({
            message : "verification code required ",
            success :false,
            error:true
        })
     }
    const user  = await userModel.findOne({
        verifyTokenEmail :code 
    })
    if(!user){
        return res.status(400).json({
            message : " Invalid or expired verification link",
            success : false,
            error:true 
        })
    }

    user.is_email_verified = true ;
    user.verifyTokenEmail = "";
    await user.save();

    return res.status(200).json({
            message : "Verified email",
            success : true ,
            error:false 
        })
    

    }
    catch(err){
         return res.status(500).json({
            message:err.message || err ,
            success:true ,
            error :false
         })
    }
} 

export const logoutUser = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
        };

        res.clearCookie("accessToken", cookieOptions)
           .status(200)
           .json({
               success: true,
               message: "Logged out successfully",
               error: false
           });

    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({
            success: false,
            message: "Server error during logout",
            error: true
        });
    }
};