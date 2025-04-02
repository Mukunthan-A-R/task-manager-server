const express = require("express");
const { pool } = require("../db/db");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const bodyParser = require("body-parser");

const router = express();
// Middleware to parse JSON
router.use(bodyParser.json());

// router.get("/", (req, res) => {
//   res.send("vanakkam");
// });

// Register Endpoint
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = validate({ name, email, password });
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the email is already registered
  const checkEmailQuery = "SELECT * FROM users WHERE email = $1";
  const existingUser = await pool.query(checkEmailQuery, [email]);

  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "User already registered" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const insertUserQuery =
    "INSERT INTO users (name, email, password , company) VALUES ($1, $2, $3, $4) RETURNING id, name, email";
  try {
    const newUser = await pool.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
    ]);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// Joi schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  company: Joi.string().min(3).max(128).required(),
});

function validate(data) {
  return registerSchema.validate(data);
}
