const express = require("express");
const { connectDB } = require("../db/db");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { verifyUserById } = require("../models/userVerify");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Login Endpoint
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  const client = await connectDB();

  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await client.query(checkUserQuery, [email]);

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
      { expiresIn: "1d" }
    );

    const cookieExpiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    res
      .cookie("doneit-session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: cookieExpiryTime,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .json({
        message: "Login successful",
        token,
        user: userData, // contains all fields except password
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

// GET /users/activate/:id
router.get("/user/activate/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Example: fetch user from a database (replace with real DB logic)
    const user = await verifyUserById(userId); // Assume this is your DB call

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(
      `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Activation</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px; text-align: center; }
          .container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          h1 { color: #2e7d32; }
          a { display: inline-block; background: #0052cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Account Activated!</h1>
          <p>Hi <span id="user-name"></span>, your account is now active.</p>
          <p>You can close this window !</p>
        </div>
      </body>
      `
    );
    // .json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
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

router.get("/auth/me", async (req, res) => {
  const client = await connectDB();
  try {
    const cookies = req.cookies;
    const token = cookies["doneit-session"];
    const decoded = jwt.verify(token, JWT_SECRET);

    const checkUserQuery = "SELECT * FROM users WHERE user_id = $1";
    const userResult = await client.query(checkUserQuery, [decoded.userId]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = userResult.rows[0];
    const { password: _, ...userData } = user;

    res.send({
      message: "Authentication succesful!",
      token,
      user: userData,
    });
  } catch (err) {
    console.log("🚀 ~ router.get ~ err:", err);
    return res
      .cookie("doneit-session", "", {
        expires: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .status(401)
      .json({ message: "Auth token Expired" }); // <-- must return here too
  } finally {
    client.release();
  }
});

router.get("/auth/logout", (req, res) => {
  res
    .cookie("doneit-session", "", {
      expires: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .json({ message: "Logout successful" });
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
