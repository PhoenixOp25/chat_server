import express from "express";
import { getMyProfile, login, logout, newUser, searchUser } from "../controllers/user.js";
const app=express.Router();
import {singleAvatar} from "../middlewares/multer.js"
import { isAuthenticated } from "../middlewares/auth.js";


app.post("/new",singleAvatar,newUser);
app.post("/login",login);

// after this user must be logged in

app.use(isAuthenticated)
app.get("/me",getMyProfile)
app.get("/logout",logout)
app.get("/search",searchUser)
export default app;