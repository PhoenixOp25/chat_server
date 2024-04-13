import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";

// Create a new user and save it to the database and save token in cookie
const newUser=async(req,res)=>{
    const {name,username,password,bio}=req.body;
    //console.log(req.body);
    const avatar={
        public_id:"sid",
        url:"rioseg",
    };

    const user= await User.create({
        name,
         bio,
        username,
        password,
        avatar,
      });

    // res.status(201).json({message:"user created succesfully"})
    sendToken(res,user,201,"user created ")
};

const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username }).select("+password");
  
    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));
  
    const isMatch = await compare(password, user.password);
  
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 404));
  
    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
  });
  
const getMyProfile = async (req, res, next) => {
    const user = await User.findById(req.user);
  
    if (!user) return next(new ErrorHandler("User not found", 404));
  
    res.status(200).json({
      success: true,
      user,
    });
  };
  const logout = TryCatch(async (req, res) => {
    return res
      .status(200)
      .cookie("chat-token", "", { ...cookieOptions, maxAge: 0 })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  });

  const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;
  
    // Finding All my chats
    const myChats = await Chat.find({ groupChat: false, members: req.user });
  
    //  extracting All Users from my chats means friends or people I have chatted with
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);
  
    // Finding all users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" },
    });
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
      }));
    
      return res.status(200).json({
        success: true,
        users,
      });
    });

  
  
  
export {login,newUser,getMyProfile,logout,searchUser};