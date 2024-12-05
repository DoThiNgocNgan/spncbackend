const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    console.log(user);
    req.user = user; // Save user info to req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
