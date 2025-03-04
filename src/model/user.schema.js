import mongoose from "mongoose";
import AuthRoles from "../utils/AuthRoles.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken"; 
import config from "../config/index.js";
import crypto from "crypto";

const userSchema=new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true,"provide a name for the user"],
            trim: true,
            maxLength:[50,"name must be less than or equal to 50 characters"]
        },
        email:{
            type:String,
            required:[true,"Give your email"]
        },
        roles:{
            type:String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER
        },
        password:{
            type: String,
            required:[true,"password must be provided"],
            select:false,
            minLength:[8,"password must be of atleast 8 characters"]
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
    },
    {timeStamps: true}
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
        this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods={
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },
    getJWTtoken: function(){
        JWT.sign({_id:this._id,role:this.role},
           config.JWT_SECRET,
           {expiresIn:config.JWT_EXPIRY} 
        )
    },

    generateForgotPasswordToken: function(){
        const forgotToken= crypto.randomBytes(20).toString("hex")

        this.forgotPasswordToken=crypto
        .createHash("sha256")
        .update(forgotToken)
        .degest("hex")

        this.forgotPasswordExpiry=Date.now()+ 20*60*1000
        return forgotToken
    }
}

export default mongoose.model("User",userSchema);