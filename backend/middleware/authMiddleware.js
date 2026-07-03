import jwt from "jsonwebtoken";

// Verify JWT token
export const verifyToken = (req, res, next) => {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

// Verify role (Factory function)
export const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        if (req.user.role === allowedRole) {
            next();
        } else {
            return res.status(403).json({ message: `Access denied. ${allowedRole} only.` });
        }
    };
};