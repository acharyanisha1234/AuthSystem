import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  createStaff,
} from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.get("/logout", logout);
router.post("/staff", verifyToken, isAdmin, createStaff);

export default router;