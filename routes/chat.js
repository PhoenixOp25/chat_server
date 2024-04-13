import express from "express";
// import {
//   addMembers,
//   deleteChat,
//   getChatDetails,
//   getMessages,
//   getMyChats,
//   getMyGroups,
//   leaveGroup,
//   newGroupChat,
//   removeMember,
//   renameGroup,
//   sendAttachments,
// } from "../controllers/chat.js";
// import {
//   addMemberValidator,
//   chatIdValidator,
//   newGroupValidator,
//   removeMemberValidator,
//   renameValidator,
//   sendAttachmentsValidator,
//   validateHandler,
// } from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.js";
import { attachmentMulter } from "../middlewares/multer.js";
// import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

// After here user must be logged in to access the routes

app.use(isAuthenticated);
// newGroupValidator(), validateHandler,
 app.post("/new", newGroupChat);

 app.get("/my", getMyChats);
 app.get("/my/groups",getMyGroups)

// app.get("/my/groups", getMyGroups);

 app.put("/addmembers", addMembers);

app.put(
  "/removemember",removeMember
);

 app.delete("/leave/:id",leaveGroup);

// // Send Attachments attachmentsMulter,
  //sendAttachmentsValidator(),
 // validateHandler,
 app.post(
  "/message",attachmentMulter
  
,   sendAttachments
);


// Get Messages
app.get("/message/:id", getMessages);

// // Get Chat Details, rename,delete
app.route("/:id").get( getChatDetails)
  .put( renameGroup)
  .delete(deleteChat);

export default app;