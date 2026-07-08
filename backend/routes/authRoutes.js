import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  createStaff,
} from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

// Create an Express router instance
const router = express.Router();


// PUBLIC ROUTES – No authentication required

// ---- POST /api/auth/register ----
// Register a new user (default role: CUSTOMER).
// Accepts: username, email, password, fullName (and optional role).
router.post("/register", register);

// ---- POST /api/auth/login ----
// Authenticate a user with email + password.
// Returns: accessToken (JWT) + sets HTTP‑only refreshToken cookie.
router.post("/login", login);

// ---- GET /api/auth/refresh ----
// Generate a new accessToken using the refreshToken cookie.
// Used by the frontend interceptor when the access token expires.
router.get("/refresh", refreshToken);

// ---- GET /api/auth/logout ----
// Clear the refreshToken cookie and log the user out.
router.get("/logout", logout);


// ADMIN-ONLY ROUTE


// ---- POST /api/auth/staff ----
// Create a new staff member (role: STAFF).
// Requires authentication + admin privileges.
router.post("/staff", verifyToken, isAdmin, createStaff);

export default router;