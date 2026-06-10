import mongoose from "mongoose";
import { config } from "node:process";

// DATABASE CONNECTION FUNCTION
// Connects MongoDB using Mongoose
export const connectDB = async () => {
    try {
        // Connect to MongoDB using environment variable
        const conn = await mongoose.connect(process.env.MONGO_URL);

        // Log successful connection with host info
        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {
        // Log connection error if DB fails
        console.error("Error connecting to MongoDB:", error);

        // Exit process with failure status
        process.exit(1);
    }
};