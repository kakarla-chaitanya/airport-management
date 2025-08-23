import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const mongoUrl=process.env.MONGODB_URL;

export async function connectDB(){
    try{
        if (mongoose.connection.readyState===1 || mongoose.connection.readyState===2){
            return;
        }
        if (!mongoUrl){
            throw new Error("Invalid Mongo DB URL");
        }
        await mongoose.connect(mongoUrl);
        console.log("connected to Mongo DB");
    }catch(e){
        console.log(e);
        throw e;
    }
}

export async function disconnectDB() {
    if (mongoose.connection.readyState===0 || mongoose.connection.readyState===3){
        return;
    }
    await mongoose.disconnect();
    console.log("Disconnected from mongoose");
}

export default mongoose;