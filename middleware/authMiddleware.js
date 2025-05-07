// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// You should keep this secret in your environment variables (.env)
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid auth token" }); // <-- must return here
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // proceed if verified
  } catch (err) {
    return res.status(401).json({ message: "Invalid auth token" }); // <-- must return here too
  }
  //   return res.status(200).json({ message: "You are allowed" });
}

module.exports = authMiddleware;
