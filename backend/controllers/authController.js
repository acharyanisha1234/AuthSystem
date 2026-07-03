import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role ? role.toUpperCase() : "CUSTOMER",   // force uppercase
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN (unchanged, but role is already uppercase)
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,   // already uppercase
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//===LOGING USER===
export const login = async (req, res) => {
    // Get email and password from request body
    const {email, password} = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required"});
    }

    try {
        // Find user by email
        const user = await User.findOne({email});
        // Check if user exists
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

         // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        // If passwords don't match
        if (!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

         // Generate Access Token (short-lived token)
        const accessToken = jwt.sign({
            id: user._id,
            role: user.role
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: "15m"
        }
    );

     // Generate Refresh Token (long-lived token)
    const refreshToken = jwt.sign({
            id: user._id,
            role: user.role
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: "7d"
        }
    );

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    // Send access token and user information
    res.status(200).json({
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
      
    } catch (error) {
        console.error("Error logging in user:", error); // Log error
        return res.status(500).json({message: "Server error"}); // Return server error response
    }
};

//===REFRESH ACCESS TOKEN===
export const refreshToken = async (req, res) => {
    // Get refresh token from cookies
    const token = req.cookies.refreshToken;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "No refresh token provided"});
    }
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET); // Verify refresh token
        const user = await User.findById(decoded.id);// Find user using decoded ID

        // Check if user exists 
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            {id: user._id, role: user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

         // Return new access token and user information
        res.status(200).json({
        accessToken: newAccessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });

        
    } catch (error) {
        console.error("Error refreshing token:", error);// Log error
        return res.status(500).json({message: "Server error"}); // Return server error response
    }
}

//===LOGOUT USER===
export const logout = (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        // Send success response
        res.status(200).json({message: "Logged out successfully"});    
    } catch (error) {
        console.error("Error logging out user:", error);// Log error
        return res.status(500).json({message: "Server error"});// Return server error response
    }
}