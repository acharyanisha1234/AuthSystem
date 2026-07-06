import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { getStats, getUsers, deleteUser } from "../controllers/userController.js";
import { createStaff } from "../controllers/authController.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getStats);
router.get("/users", verifyToken, isAdmin, getUsers);   
router.post("/staff", verifyToken, isAdmin, createStaff);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

export default router;