"use server";   

import mongoose from "mongoose";
//singleton connection: check nếu mongoose đã kết nối rồi thì không kết nối lại
let isConnected: boolean = false; //track the connection
export const connectToDatabase = async () => {
    if(!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not set");
    }
    if(isConnected){
        console.log("MONGODB is already connected");
        return;
    }
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "ucademy"});
            isConnected = true; 
            console.log("MONGODB connected");
    }catch (error){
        console.log("Error while connecting", error);
    }
};