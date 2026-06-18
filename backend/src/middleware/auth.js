const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  try {
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      const error = new Error("JWT secret is not configured securely");
      error.statusCode = 500;
      throw error;
    }

    // Get token from header
    // Header format: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return res.status(401).json({
        success: false,
        error: "Invalid authorization header.",
      });
    }

    const token = parts[1];

    // Verify token using our secret
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Attach user info to request
    // Now every protected route can access req.user
    req.user = decoded;

    next(); // move to next middleware/controller
  } catch (err) {
    next(err); // sends to errorHandler
  }
};

module.exports = authenticate;
