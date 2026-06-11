import mongoose from "mongoose";


// USER MODEL SCHEMA
// Defines structure of user data
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // User's name
    email: { type: String, required: true, unique: true }, // Unique email
    password: { type: String, required: true }, // Hashed password
    role: { type: String, default: "user", enum: ["user", "admin", "Staff"] }, // User role
},
{ timestamps: true } // Adds createdAt and updatedAt fields
);

// Export User model
export default mongoose.model("User", userSchema);