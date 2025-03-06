import mongoose from "mongoose";

const productSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"provide a name"],
            trim:true,
            maxLength:[120,"product name should not be more than of 120 characters"]
        },
        price:{
            type:Number,
            required:[true,"provide price of the product"],
            maxLength:[5,"product price should not be more than 5 chars"]
        },
        description:{
            type:String
        },
        photos:[
            {
                secure_url:{
                    type:String,
                    required:true
                }
            }
        ],
        stock:{
            type:Number,
            default:0
        },
        sold:{
            type:Number,
            default:0
        },
        collectionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
    },
    {timestamps:true}
)

export default mongoose.model("Product",productSchema);