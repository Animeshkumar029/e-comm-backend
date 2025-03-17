import Product from "../model/product.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js"
import formidable from "formidable";
import config from "../config/index.js";
import Mongoose, { isObjectIdOrHexString } from "mongoose";
import { s3FileUpload,s3FileDelete } from "../service/imageUpload.js";
import fs from "fs";

export const addproduct=asyncHandler(async(req,res)=>{
    const form=formidable({multiples:true,keepExtensions:true});
    form.parse(req,async(err,feilds,files)=>{
        if(err){
            throw new CustomError(err.message || "something went wrong",500);
        }

        let productId=new Mongoose.Types.ObjectId().toHexString();

        if(!feilds.name||
            !feilds.price||
            !feilds.collectionId||
            !feilds.description
        ){
            throw new CustomError("please fill all the feilds",500);
        }

        let imgArrayResp=Promise.all(
            Object.keys(files).map(async(file,index)=>{
                const element=file[fileKey];
                const data=fs.readFileSync(element.filepath);

                const upload= await s3FileUpload({
                    bucketName: config.s3_BUCKET_NAME,
                    key:`products/${productId}/photo_${index+1}.png`,
                    body: data,
                    contentType: element.mimetype
                })

                return {secure_url: upload.Location}
            })
        )

        let imgArray= await imgArrayResp

        const product= await Product.create({
            _id: productId,
            photos:imgArray,
            ...feilds
        })

        if(!product){
            throw new CustomError("Product failed to be created in database",500);
        }

        res.status(200).json({
            success:true,
            products
        })
    })
});

export const getAllProducts=asyncHandler(async(req,res)=>{
    const products=await Product.find({});

    if(!products) throw new CustomError("No product found in db",400)

        res.status(200).json({
            success:true,
            products
        })
});

export const getproductById= asyncHandler(async(req,res)=>{
    const {id:productId}=req.params;
    const product =await Product.findById(productId);
    if(!product) throw new CustomError("product does not exist in database",400);

    res.status(200).json({
        success:true,
        product
    })
});

export const getProductByCollectionId=asyncHandler(async(req,res)=>{
    const {id:collectionId}=req.params;
    const product=await Product.find({collectionId});
    if(!product) throw new CustomError("product does not exist in the database",400);
    res.status(200).json({
        success:true,
        product
    })
});

export const deleteproduct=asyncHandler(async(req,res)=>{
    const {id:productId}=req.params;
    const product=await Product.findById(productId);
    if(!product ) throw new CustomError("product does not exist in database",400);


    const deletePhotos=Promise.all(
        product.photos.map(async(ele,index)=>{
            await s3FileDelete({
                bucketName: config.s3_BUCKET_NAME,
                key:`products/${product._id.toString()}/photos_${index+1}.png`
            })
        })
    );
    await deletePhotos;
    await product.remove();
    res.status(200).json({
        success:true,
        message:"product has been deleted successfully"
    })
});


