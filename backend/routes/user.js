import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
    getUsers,
    deleteUser,
    getProfile
} from "../controllers/userController.js";

const router = express.Router();


// GET ALL USERS (ADMIN ONLY)
router.get("/", verifyToken, verifyRole("admin"), getUsers);


// DELETE USER (ADMIN ONLY)
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);


// GET LOGGED IN USER PROFILE
router.get("/me", verifyToken, getProfile);

export default router; 