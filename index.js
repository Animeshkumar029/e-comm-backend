const mongoose=require("mongoose");
const app=require("./src/app.js");
const config=require("./src/config/index.js");

(
    async()=>{
        try{
           await mongoose.connect(config.MONGODB_URL);
            console.log("DB CONNECTED")

            app.on('error',(err)=>{
                console.log("error-->>",err);
                throw err;
            })

            app.listen(config.PORT,()=>{
                `listening on port ${config.PORT}`;
            })
            

        }
        catch(err){
            console.log("error--->>>",err);
            throw err;
        }
    }
)()