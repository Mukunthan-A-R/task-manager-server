const { pool } = require("../db/db");

// Get user by email
const getUserByEmail = async (email) => {
  const res = await pool.query(
    `SELECT user_id, name FROM users WHERE email = $1`,
    [email]
  );
  return res.rows[0];
};

// Insert or update reset token
const upsertResetToken = async (userId, token, expiresAt) => {
  await pool.query(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3`,
    [userId, token, expiresAt]
  );
};

// Get valid token
const getValidToken = async (token) => {
  const res = await pool.query(
    `SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW()`,
    [token]
  );
  return res.rows[0];
};

// Update user password
const updateUserPassword = async (userId, hashedPassword) => {
  await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
    hashedPassword,
    userId,
  ]);
};

// Delete token
const deleteResetToken = async (userId) => {
  await pool.query(`DELETE FROM password_resets WHERE user_id = $1`, [userId]);
};

module.exports = {
  getUserByEmail,
  upsertResetToken,
  getValidToken,
  updateUserPassword,
  deleteResetToken,
};
