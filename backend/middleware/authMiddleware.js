import jwt from "jsonwebtoken";

 //===VERIFY TOKEN===
 // Middleware to verify JWT access token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Get Authorization header from request
    // Check if token is provided
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided"});

    }
     // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];
    // Verify token using secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // If token is invalid or expired
        if (err) {
            return res.status(403).json({message: "Invalid token"});
        }
        req.user = user; // Store decoded user information in request object
        next();// Pass control to next middleware

    });
}

//===VERIFY ROLE===
// Middleware to check if user has the required role
export const verifyRole = (role) => {
    // Return middleware function
    return (req, res, next) => {
        // Get role from authenticated user
        const userRole = req.user?.role;
        // Check if user's role matches required role
        if (userRole !== role) {
            return res.status(403).json({message: "Access Denied"});
        }
    next(); // Allow access if role matches
};
};