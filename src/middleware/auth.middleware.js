import config from "../config.js";
import asyncHandler from "../service/asyncHandler.js";
import User from "../model/user.schema.js";
import JWT from "jsonwebtoken";
import CustomError from "../utils/customError";


export const isLoggedIn=asyncHandler(async(req,res,next)=>{
    let token;

    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token=req.cookies.token || req.headers.authorization.split()[1];
    }

    if(!token) throw new CustomError("Invalid token or Not Authorized to access the resource",400);
    
    try {
        const decodedJWTpayload=JWT.verify(token,config.JWT_SECRET);
        req.user=await User.findById(decodedJWTpayload._id,"name email,role");
        next()
    } catch (error) {
        throw new CustomError("Not authorized to access this resouce",401);
    }
})

export const authorize=(...requiredRoles)=>asyncHandler(async(req,res,next)=>{
    if(!requiredRoles.includes(req.user.role)){
        throw new CustomError("you are not authorized to access this resource",400);
    }
    next();
})