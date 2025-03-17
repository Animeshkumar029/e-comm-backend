import { Router } from "express";
import {getProfile,login,logout,signup} from "../controller/auth.controller.js";
import {isLoggedIn} from "../middleware/auth.middleware.js";
import { get } from "mongoose";


const router=Router;

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.get("/profile",isLoggedIn,getProfile);

export default router;

