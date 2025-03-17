const express=require("express");
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";

const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

app.use("/api/v1/",routes);
app.get("/",(_req,res)=>{
    res.send("hello there - API")
})

app.all("*",(_req,res)=>{
    return res.status(404).json({
        success: false,
        nessage: "route not found"
    })
})

module.exports=app;