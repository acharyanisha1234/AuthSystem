import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { getStats, getUsers } from "../controllers/userController.js";
import { createStaff } from "../controllers/authController.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getStats);
router.get("/users", verifyToken, isAdmin, getUsers);    // Added for User Management
router.post("/staff", verifyToken, isAdmin, createStaff);

export default router;