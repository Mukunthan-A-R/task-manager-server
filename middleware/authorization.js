const express = require("express");
const { pool } = require("../db/db");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const router = express();

// Middleware to parse JSON
router.use(bodyParser.json());

// Secret key for JWT (should be stored in an environment variable)
const JWT_SECRET = "your_jwt_secret_key";

// Login Endpoint
router.post("/login", async (req, res) => {
  // Validate login request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  // Check if user exists in the database
  const checkUserQuery = "SELECT * FROM users WHERE email = $1";
  const userResult = await pool.query(checkUserQuery, [email]);

  if (userResult.rows.length === 0) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = userResult.rows[0];

  // Compare the password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h", // Set token expiration time (1 hour)
  });

  // Send the token to the client
  res.status(200).json({ message: "Login successful", token });
});

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store user info in request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Protected Route Example
router.get("/profile", verifyToken, (req, res) => {
  // Accessing user info from the decoded token
  const { userId, email } = req.user;

  res
    .status(200)
    .json({ message: "Profile accessed", user: { userId, email } });
});

module.exports = router;

// Joi schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

// Joi schema for login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});
