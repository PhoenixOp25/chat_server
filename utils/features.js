import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
    mongoose
      .connect(uri, { dbName: "Chat" })
      .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
      .catch((err) => {
        throw err;
      });
  };
  
const sendToken = (res, user, code, message) => {
  // jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
 // console.log(process.env.JWT_SECRET)
  const token =jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
 
  return res.status(code).cookie("chat-token", token,cookieOptions).json({
    success: true,
    //user,
    message,
  });
};
const emitEvent = (req, event, users, data) => {
  console.log("Emitting event ",event )
  // const io = req.app.get("io");
  // const usersSocket = getSockets(users);
  // io.to(usersSocket).emit(event, data);
};

const deletFilesFromCloudinary = async (public_ids) => {
  // Delete files from cloudinary
};


  export {connectDB,sendToken,cookieOptions,emitEvent,deletFilesFromCloudinary}