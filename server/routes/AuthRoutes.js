import { Router } from "express";
import {
  getUserInfo,
  signin,
  signup,
  updateUserInfo,
  uploadAvatar,
  logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/Authmiddleware.js";

const authRoutes = Router();
authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-user-info", verifyToken, updateUserInfo);
authRoutes.post("/upload-avatar", verifyToken, uploadAvatar);
authRoutes.post("/logout", logout);
export default authRoutes;
