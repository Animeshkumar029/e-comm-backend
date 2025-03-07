import { TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import User from "../model/user.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError";

export const cookieOptions={
    expires: new Date(Date.now()+30*24*60*60*1000),
    httpOnly: true
}

export const signup=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        throw new CustomError("feild is empty",400);
    }

    const existingUser=await User.findOne({email});
    if(existingUser) throw new CustomError("User already exists",400);

    const user=await User.create({
        name,
        email,
        password
    })

    const token=user.getJwtToken();

    user.password=undefined;

    res.cookie("token",token,cookieOptions);

    res.status(200).json({
        success:true,
        token,
        user
    })
})

export const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    if(!email||!password) throw new CustomError("fill all the feilds",400);

    const user=User.findOne({email}).select("+password");

    if(!user) throw new CustomError("Invalid credentials",400);

    const isPassword=await user.comparePassword(password);

    if(isPassword){
        const token=user.getJwtToken();
        user.password=undefined;
        res.cookie("token",token,cookieOptions);
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new CustomError("password is incorrect",400);
})

export const logout=asyncHandler(async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })


    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})