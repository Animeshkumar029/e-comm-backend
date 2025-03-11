import mongoose from "mongoose";

const couponSchema=new mongoose.Schema({
    code:{
        type:String,
        required: [true,"please provide a coupon code"]
    },
    discount:{
        type: Number,
        default: 0
        //required: true
    },
    active:{
        type: Boolean,
        default:true
        //required: true
    }

},
    {timestamps:true}
);

export default mongoose.model("Coupon",couponSchema);