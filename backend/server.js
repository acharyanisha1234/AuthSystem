import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
<<<<<<< HEAD
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
   origin: "http://localhost:5173", //Adjust this to your frontend URL
   credentials: true,
}))
app.use(cookieParser());

app.use('api/auth',authRoutes);
app.use('/api/users',userRoutes);
=======

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();


>>>>>>> b39426789d7b93c1c7da4d7dedfecac64666be93
connectDB();
app.listen(5000, () => {
    console.log(`Server is running on ${PORT}`);
});