import jwt from "jsonwebtoken";
import userModel from "../models/User.model.js";
import { error } from "console";
import {generateOtp} from "./generateOtp.js";


const generatedRefreshToken = async (userId)=>{
   const token =await jwt.sign({id:userId}, 
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {expiresIn: '7d'})

   const updateRefereshToken = await userModel.updateOne(
      {_id:userId},
   {refresh_token: token})
   
   return token;
}
const otp = generateOtp(); 
export default generatedRefreshToken