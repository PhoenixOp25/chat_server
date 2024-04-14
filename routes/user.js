import express from "express";
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../controllers/user.js";
const app=express.Router();
import {singleAvatar} from "../middlewares/multer.js"
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";


app.post("/new",singleAvatar,registerValidator(),validateHandler,newUser);
app.post("/login",loginValidator(),validateHandler,login);

// after this user must be logged in

app.use(isAuthenticated)
app.get("/me",getMyProfile)
app.get("/logout",logout)
app.get("/search",searchUser)
app.put("/sendrequest",sendRequestValidator(),validateHandler ,sendFriendRequest)
app.put("/acceptrequest",acceptRequestValidator(),validateHandler ,acceptFriendRequest)
app.get("/notifications",getMyNotifications)
app.get("/friends",getMyFriends)
export default app;