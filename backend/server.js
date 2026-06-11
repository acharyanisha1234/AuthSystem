import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.js"; // ⚠️ FIX THIS NAME if different

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middlewares
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", //Adjust this to your frontend URL
    credentials: true,
}));
app.use(cookieParser());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


// DB Connection
connectDB();


// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});