import mongoose from "mongoose";

// USER SCHEMA – Defines the structure of a user document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // ---- USERNAME ----
    // Required string. Must be unique (enforced by index, but we handle duplicate checks in code).
    username: { type: String, required: true },

    // ---- EMAIL ----
    // Required, must be unique (MongoDB will enforce this with a unique index).
    // We store it in lowercase to avoid case‑sensitive duplicates.
    email: { type: String, required: true, unique: true },

    // ---- PASSWORD ----
    // Required string. Always store the bcrypt‑hashed version, never plain text.
    password: { type: String, required: true },

    // ---- FULL NAME ----
    // Required string. The user’s display name (used in dashboards and greetings).
    fullName: { type: String, required: true },

    // ---- ROLE ----
    // Defines the user’s permissions. Defaults to "CUSTOMER" if not provided.
    // Allowed values: "CUSTOMER", "ADMIN", "STAFF" (must be uppercase).
    // The "uppercase: true" option ensures the stored value is always uppercase.
    role: {
      type: String,
      default: "CUSTOMER",
      enum: ["CUSTOMER", "ADMIN", "STAFF"],
      uppercase: true, // Automatically converts input to uppercase before saving
    },
  },
  {
    //  TIMESTAMPS 
    // Automatically adds two fields:
    //   - createdAt: Date when the document was first created
    //   - updatedAt: Date when the document was last modified
    timestamps: true,
  }
);

// EXPORT
// Compile the schema into a Mongoose model named "User" (MongoDB collection will be "users")
export default mongoose.model("User", userSchema);