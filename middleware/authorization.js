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
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(checkUserQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Remove the password field before sending user data
    const { password: _, ...userData } = user;

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData, // contains all fields except password
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Route Example
router.get("/profile", (req, res) => {
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
