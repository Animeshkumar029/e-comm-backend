import mongoose from "mongoose";
import statusType from "../utils/statusType";

const orderSchema=new mongoose.Schema({
    product:{
        type:[
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                count: Number,
                price: Number
            }
        ],
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address:{type: String, required: true},
    phoneNumber:{type: Number,required: true},
    amount:{type: Number,required: true},
    status:{
        type: String,
        enum: Object.values(statusType),
        default: statusType.ORDERED
    },
    coupon:{type: String},
    transactioniId:{type:String}
},
{timestamps: true}
);

export default mongoose.model("Order",orderSchema);