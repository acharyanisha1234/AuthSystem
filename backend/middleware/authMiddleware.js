import jwt from "jsonwebtoken";


// VERIFY TOKEN – Middleware to check if the request has a valid JWT
export const verifyToken = (req, res, next) => {
  // 1. Retrieve the Authorization header from the request
  const authHeader = req.headers.authorization;

  // 2. If the header is missing or does not start with "Bearer ", reject the request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  // 3. Extract the token (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify the token using the ACCESS_TOKEN_SECRET from environment variables
    //    The decoded payload contains the user's id and role (and other fields)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 5. Attach the decoded user data to the request object (req.user)
    //    So that subsequent middleware and route handlers can access it
    req.user = decoded;

    // 6. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // 7. If verification fails (expired, invalid signature, etc.),
    //    return a 401 Unauthorized status.
    //    The frontend interceptor will catch this and try to refresh the token.
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// IS ADMIN – Middleware to restrict access to users with role "ADMIN"

export const isAdmin = (req, res, next) => {
  // 1. Check if req.user exists (should be set by verifyToken) and if its role is "ADMIN"
  //    Note: The role string is case‑sensitive – must be uppercase "ADMIN" as stored in DB.
  if (req.user && req.user.role === "ADMIN") {
    // 2. If the user is an admin, allow the request to proceed
    next();
  } else {
    // 3. Otherwise, respond with a 403 Forbidden status
    res.status(403).json({ message: "Admin access required" });
  }
};