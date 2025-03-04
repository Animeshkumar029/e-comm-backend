import mongoose from "mongoose";
import AuthRoles from "../utils/AuthRoles.js";
import bcrypt from "bcryptjs";

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
    }
}

export default mongoose.model("User",userSchema);