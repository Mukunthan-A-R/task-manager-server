const { pool } = require("../db/db");

// ✅ Get one user by ID
const getUserByEmail = async (email) => {
  const client = await pool.connect();
  const query =
    "SELECT user_id, name, email, company, role FROM users WHERE email = $1";

  try {
    const res = await client.query(query, [email]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with email ${email} not found.`,
      };
    }

    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return err;
  } finally {
    client.release();
  }
};

module.exports = { getUserByEmail };
