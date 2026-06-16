const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
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
    const token = authHeader.split(" ")[1];

    // Verify token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    // Now every protected route can access req.user
    req.user = decoded;

    next(); // move to next middleware/controller
  } catch (err) {
    next(err); // sends to errorHandler
  }
};

module.exports = authenticate;
