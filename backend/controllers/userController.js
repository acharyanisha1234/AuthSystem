import User from "../models/User.js";

//===GET USERS===
//Controller to fetch users with pagination
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default is 1
        const limit = parseInt(req.query.limit) || 2;  // Get limit from query parameter, default is 2 users per page
        const skip = (page - 1) * limit; // Calculate number of documents to skip
        const total = await User.countDocuments();  // Count total number of users in the database
        const users = await User.find().skip(skip).limit(limit).select("-password");  // Fetch users with pagination and exclude password field

        // Send paginated users and pagination details
        res.status(200).json({
            users, total, totalPages: Math.ceil(total / limit), currentPage: page 
        })
    } catch (error) {
        console.error("Error fetching users:", error); //Log error
        return res.status(500).json({message: "Server error"}); //Return server error response
        
    }
};

//===DELETE USER===
//Controller to delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        // Find user by ID and delete from database
        const user = await User.findByIdAndDelete(req.params.id);
         // Check if user exists
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json({message: "User deleted successfully"}); // Send success response after deletion
        
    } catch (error) {
       console.error("Error deleting user:", error); //Log error
       return res.status(500).json({message: "Server error"}); //Return server error response 
    }
};

//===GET PROFILE===
//Controller to fetch the currently logged-in user's profile
export const getProfile = async (req, res) => {
    try {
        // Find user by ID stored in req.user by authentication middleware
        const user = await User.findById(req.user.id).select("-password");
        // Check if user exists
        if(!user) {
            return res.status(404).json({message: "user not found"});
        }
        // Send user profile data
        res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching profile:", error); //Log error
      return res.status(500).json({message: "Server error"}); //Return server error response   
    }
};