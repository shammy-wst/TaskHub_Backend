const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || authHeader === "Bearer null") {
      return res.status(401).json({
        message: "Unauthorized",
        details: "Please login",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
        details: "Token must start with 'Bearer '",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
        details: "Token not provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid token",
          details: err.message,
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: "Server error",
      details: "Error verifying token",
    });
  }
};

module.exports = authenticateToken;
