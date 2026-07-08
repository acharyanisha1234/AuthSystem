import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { getStats, getUsers, deleteUser } from "../controllers/userController.js";
import { createStaff } from "../controllers/authController.js";

// Create an Express router instance
const router = express.Router();


// ADMIN ROUTES – All routes in this file are protected by:
//   1. verifyToken – ensures the user is authenticated
//   2. isAdmin    – ensures the authenticated user has role "ADMIN"


// ---- GET /api/admin/stats ----
// Returns platform statistics (total users, admins, staff, customers).
// Useful for admin dashboard overviews.
router.get("/stats", verifyToken, isAdmin, getStats);

// ---- GET /api/admin/users ----
// Returns a list of all registered users (without passwords).
// Used by admins to manage user accounts.
router.get("/users", verifyToken, isAdmin, getUsers);

// ---- POST /api/admin/staff ----
// Creates a new staff member (role: STAFF).
// Only admins can create staff accounts.
router.post("/staff", verifyToken, isAdmin, createStaff);

// ---- DELETE /api/admin/users/:id ----
// Permanently deletes a user by their ID.
// Allows admins to remove any user account.
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// Export the router so it can be mounted in the main app (e.g., app.use("/api/admin", adminRoutes))
export default router;