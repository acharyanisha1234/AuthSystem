import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();


// ALL ROUTES REQUIRE A VALID JWT ACCESS TOKEN
// The verifyToken middleware ensures the user is logged in.


// ---- GET /api/users/profile ----
// Fetch the logged‑in user's own profile data (username, email, fullName, role, etc.).
router.get("/profile", verifyToken, getProfile);

// ---- PUT /api/users/profile ----
// Update the logged‑in user's profile (username, email, or fullName).
// Duplicate email/username checks are handled in the controller.
router.put("/profile", verifyToken, updateProfile);

// ---- POST /api/users/change-password ----
// Change the user's password.
// Requires current password verification and a new password (min 6 chars).
router.post("/change-password", verifyToken, changePassword);

export default router;