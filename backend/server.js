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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);          //  handles /profile, /update, /change-password
app.use("/api/admin", adminRoutes);

// Direct profile endpoints (to match frontend calls)
app.get("/api/staff/profile", verifyToken, getProfile);
app.get("/api/customer/profile", verifyToken, getProfile);
connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
});