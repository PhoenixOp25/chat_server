import express from "express"
import userRoute from "./routes/user.js"
import chatRoute from "./routes/chat.js" 
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";



// import mongoose from "mongoose";
// mongoose.connect("mongodb://127.0.0.1:27017").then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
// });

import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import { createUser } from "./seeders/user.js";
import { createGroupChats, createMessages, createMessagesInAChat, createSingleChats } from "./seeders/chat.js";

dotenv.config({
    path: "./.env",
  });

  const mongoURI = process.env.MONGO_URI;
  const port = process.env.PORT || 3000;

  //createMessagesInAChat("661a19049bb0498544b3b840",50)
const app=express();

//use middllewares
app.use(express.json())
app.use(cookieParser());
//app.use(express.urlencoded())
connectDB(mongoURI)

app.use("/user",userRoute)
app.use("/chat",chatRoute)

app.get("/",(req,res)=>{
    res.send("hello world");
})
app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`Server is running on port ${port} `);
})