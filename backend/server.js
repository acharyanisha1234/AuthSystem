import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { verifyToken } from "./middleware/auth.js";
import { getProfile } from "./controllers/userController.js";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

// Parse JSON request bodies
app.use(express.json());

// Enable CORS for specific frontend origins (Vite dev servers)
// Allow credentials (cookies) to be sent cross‑origin
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);

// Parse cookies attached to the request (needed for refreshToken)
app.use(cookieParser());

// ============================================================
// ROUTE MOUNTING
// ============================================================

// ---- Auth routes (public + staff creation) ----
// Mounted at /api/auth
app.use("/api/auth", authRoutes);

// ---- User routes (authenticated profile & password) ----
// Mounted at /api/users
app.use("/api/users", userRoutes);

// ---- Admin routes (admin‑only operations) ----
// Mounted at /api/admin
app.use("/api/admin", adminRoutes);

// ============================================================
// DIRECT PROFILE ENDPOINTS (for role‑specific frontend dashboards)
// ============================================================
// The frontend dashboards (StaffDashboard, CustomerDashboard)
// call GET /api/staff/profile and /api/customer/profile respectively.
// Both share the same getProfile controller – the user's role
// determines the dashboard content.
// 
// They require valid token authentication (verifyToken).
app.get("/api/staff/profile", verifyToken, getProfile);
app.get("/api/customer/profile", verifyToken, getProfile);

// ============================================================
// DATABASE CONNECTION & SERVER START
// ============================================================

// Connect to MongoDB
connectDB();

// Start the Express server on all network interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
});