import { TryCatch } from "../middlewares/error.js";
import {Chat} from '../models/chat.js'
import { emitEvent } from "../utils/features.js";
import {
    ALERT,
   // NEW_MESSAGE,
    // NEW_MESSAGE_ALERT,
     REFETCH_CHATS,
  } from "../constants/events.js";
import { ErrorHandler } from "../utils/utility.js";
const newGroupChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body;
  if(members.length<2)return next(new ErrorHandler("group length>2",400));
    const allMembers = [...members, req.user]; 
  
    await Chat.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });
  
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);
  
    return res.status(201).json({
      success: true,
      message: "Group Created",
    });
  });
  export {newGroupChat}