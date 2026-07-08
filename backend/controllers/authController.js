import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// REGISTER – Create a new user (CUSTOMER by default, or STAFF/ADMIN if specified)
export const register = async (req, res) => {
  // Destructure required fields from request body
  const { username, email, password, fullName, role } = req.body;

  // Validate that all mandatory fields are present
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Normalize email to lowercase to avoid case‑sensitive duplicates
    const normalizedEmail = email.toLowerCase();

    // Check if email already exists in the database
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the plain‑text password using bcrypt with salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance (Mongoose document)
    const user = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      fullName,   // Store the user's full name (provided in request)
      role: role ? role.toUpperCase() : "CUSTOMER", // Default role: CUSTOMER
    });

    // Save the user to the database
    await user.save();

    // Respond with success and the created user data (excluding password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    // Generic internal server error
    return res.status(500).json({ message: "Internal server error" });
  }
};


// LOGIN – Authenticate a user and return access + refresh tokens
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Normalize email and find the user by email
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // If no user found, respond with "User not found"
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure role is uppercase for consistency
    const normalizedRole = user.role.toUpperCase();

    // Create an access token (short‑lived: 15 minutes)
    const accessToken = jwt.sign(
      { id: user._id, role: normalizedRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Create a refresh token (long‑lived: 7 days)
    const refreshToken = jwt.sign(
      { id: user._id, role: normalizedRole },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Store the refresh token in an HTTP‑only cookie for security
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,              // Prevents client‑side JavaScript access
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
      sameSite: "strict",          // CSRF protection
    });

    // Send the access token and user data (excluding password) back to the client
    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,   // Include fullName for the frontend
        role: normalizedRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// REFRESH TOKEN – Generate a new access token using a valid refresh token
export const refreshToken = async (req, res) => {
  // Retrieve the refresh token from the HTTP‑only cookie
  const token = req.cookies.refreshToken;

  // If no token is present, the user must re‑authenticate
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify the refresh token using the secret
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Find the user by the ID stored in the token payload
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const normalizedRole = user.role.toUpperCase();

    // Issue a new access token (valid for 15 minutes)
    const newAccessToken = jwt.sign(
      { id: user._id, role: normalizedRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Return the fresh access token along with current user data
    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,   // Include fullName again for consistency
        role: normalizedRole,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// LOGOUT – Clear the refresh token cookie (client discards access token)
export const logout = (req, res) => {
  try {
    // Clear the refresh token cookie by setting it to expire immediately
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// CREATE STAFF – Admin only: Create a new user with role "STAFF"
export const createStaff = async (req, res) => {
  // Destructure the required fields (same as registration)
  const { username, email, password, fullName } = req.body;

  // Validate that all fields are present
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase();

    // Check for duplicate email
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check for duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User with role forced to "STAFF"
    const staff = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      fullName,   // Store the staff member's full name
      role: "STAFF", // Explicitly set role
    });

    // Save to the database
    await staff.save();

    // Return the created staff data (without password)
    res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      user: {
        id: staff._id,
        username: staff.username,
        email: staff.email,
        fullName: staff.fullName,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Create staff error:", error);

    // Handle duplicate key errors (email or username)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};