// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Auth middleware - decoded token:", decoded);
    
    // Fetch full user data from database
    const user = await User.findById(decoded.id);
    console.log("🔐 Auth middleware - found user:", user ? user.name : "null");
    
    if (!user) return res.status(401).json({ message: "User not found" });
    
    req.user = user; // attach full user object
    next();
  } catch (err) {
    console.log("🔐 Auth middleware - error:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = authMiddleware;
