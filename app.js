import express from "express"
import userRoute from "./routes/user.js"
import chatRoute from "./routes/chat.js" 
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/admin.js"
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import { Server } from "socket.io";
import {createServer} from "http"
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors"
import {v2 as cloudinary} from 'cloudinary'
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";
// import mongoose from "mongoose";
// mongoose.connect("mongodb://127.0.0.1:27017").then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
// });

dotenv.config({
    path: "./.env",
  });

  const mongoURI = process.env.MONGO_URI;
  const port = process.env.PORT || 3000;
  const envMode=process.env.NODE_ENV.trim() || "PRODUCTION";
   const adminSecretKey=process.env.ADMIN_SECRET_KEY || "phoenixop";
  //createMessagesInAChat("661a19049bb0498544b3b840",50)

  const userSocketIDs = new Map();
const onlineUsers = new Set();
const app=express();
const server=createServer(app)
const io=new Server(server,{
    cors:corsOptions
})
//use middllewares
app.set("io",io)
app.use(express.json())
app.use(cookieParser());
app.use(cors(corsOptions))
//app.use(express.urlencoded())
connectDB(mongoURI)

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

});


app.use("/api/v1/user",userRoute)
app.use("/api/v1/chat",chatRoute)
app.use("/api/v1/admin",adminRoute)
app.get("/",(req,res)=>{
    res.send("hello world");
})

io.use((socket,next)=>{
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
      );
})


io.on("connection",(socket)=>{
    //console.log("user connected...",socket.id);
    const user = socket.user;
    //console.log(user);
    userSocketIDs.set(user._id.toString(), socket.id);
//console.log(userSocketIDs)
    socket.on(NEW_MESSAGE,async({ chatId, members, message })=>{
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
              _id: user._id,
              name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
          };

          const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
          };
          //console.log("emmiting",messageForRealTime)
          const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
        //console.log("new msg",messageForRealTime);
        try {
            await Message.create(messageForDB);
          } catch (error) {
            throw new Error(error);
          }
    })
    socket.on(START_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(START_TYPING, { chatId });
    });
    
    socket.on(STOP_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });

    socket.on(CHAT_JOINED,({userId,memebers})=>{
      onlineUsers.add(userId.toString());
      const membersSocket=getSockets(memebers);
      io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers));
    });
    socket.on(CHAT_LEAVED,({userId,memebers})=>{
      onlineUsers.delete(userId.toString());
      const membersSocket=getSockets(memebers);
      io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers));
    })

    socket.on("disconnect",()=>{
        //console.log("user disconnected bro...");
        userSocketIDs.delete(user._id.toString());
        onlineUsers.delete(user._id.toString());
        socket.broadcast.emit(ONLINE_USERS,Array.from(onlineUsers));
    })
})



app.use(errorMiddleware);

server.listen(port,()=>{ 
    console.log(`Server is running on port ${port} in ${envMode} Mode`);
})
export{
    envMode,adminSecretKey,userSocketIDs
}