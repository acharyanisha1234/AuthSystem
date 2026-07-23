import User from "../models/User.js";
import bcrypt from "bcryptjs";


// GET ALL USERS – Admin only
export const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database, but exclude the password field
    const users = await User.find({}).select("-password");
    // Send the array directly – no wrapping in a "data" object
    res.status(200).json(users);
  } catch (error) {
    // If something goes wrong, respond with a 500 error
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE USER – Admin only soft delete or permanent delete

export const deleteUser = async (req, res) => {
  try {
    // Find and delete the user by the ID from the URL parameter
    const user = await User.findByIdAndDelete(req.params.id);
    // If no user matches that ID, return a 404 Not Found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Confirm successful deletion
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET LOGGED-IN USER PROFILE – Requires authentication

export const getProfile = async (req, res) => {
  try {
    // `req.user` is set by the authentication middleware (e.g., authMiddleware)
    // Find the current user by ID and exclude the password field
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      // If user somehow not found, respond with 404
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Return the user data (excluding password)
    res.status(200).json({
      success: true,
      data: user,   // contains username, email, fullName, role, createdAt, etc.
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE PROFILE – Update username, email, or fullName

export const updateProfile = async (req, res) => {
  // Destructure the fields that can be updated
  const { username, email, fullName } = req.body;

  try {
    // Find the current user from the token (req.user.id)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update username if provided 
    if (username) {
      // Check if the new username is already taken by another user (excluding this user)
      const existing = await User.findOne({ username, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
      user.username = username;
    }

    // Update email if provided 
    if (email) {
      const normalizedEmail = email.toLowerCase();
      // Check uniqueness of the new email (excluding current user)
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already taken" });
      }
      user.email = normalizedEmail;
    }

    //  Update fullName if provided 
    if (fullName) {
      user.fullName = fullName;
    }

    // Save the updated user document
    await user.save();

    // Respond with the updated user data (without password)
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// CHANGE PASSWORD – Requires current password verification
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate that both passwords are provided
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both passwords are required" });
  }

  try {
    // Find the user by ID (from token)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare the provided current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Enforce a minimum length for the new password (6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    // Hash the new password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Confirm password change
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET STATS – Returns total counts of users by role
export const getStats = async (req, res) => {
  try {
    // Count all users
    const totalUsers = await User.countDocuments();

    // Count users with role "ADMIN" (must match the enum exactly – uppercase)
    const totalAdmins = await User.countDocuments({ role: "ADMIN" });
    const totalStaff = await User.countDocuments({ role: "STAFF" });
    const totalCustomers = await User.countDocuments({ role: "CUSTOMER" });

    // Send the stats as an object
    res.status(200).json({
      success: true,
      stats: { totalUsers, totalAdmins, totalStaff, totalCustomers },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};