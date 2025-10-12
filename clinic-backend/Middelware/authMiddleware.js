// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Accept either lowercase or capitalized header keys
  const header = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = header.split(' ')[0] === 'Bearer' ? header.split(' ')[1] : header || null;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure we attach a consistent id field
    req.user = { id: decoded.id || decoded._id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
