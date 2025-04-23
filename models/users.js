const { pool } = require("../db/db");

// Utility: Handle DB errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// ✅ Get all users
const getAllUsers = async () => {
  const client = await pool.connect();
  const query = "SELECT user_id, name, email, company, role FROM users";

  try {
    const res = await client.query(query);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// ✅ Get one user by ID
const getUser = async (id) => {
  const client = await pool.connect();
  const query =
    "SELECT user_id, name, email, company, role FROM users WHERE user_id = $1";

  try {
    const res = await client.query(query, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// ✅ Create new user
const createUser = async (data) => {
  const client = await pool.connect();
  const query = `
    INSERT INTO users (name, email, password, company)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, name, email, company, role
  `;
  const values = [data.name, data.email, data.password, data.company];

  try {
    const res = await client.query(query, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    if (err.code === "23505") {
      return {
        success: false,
        status: 400,
        error: "A user with this email already exists.",
      };
    }
    return handleError(err);
  } finally {
    client.release();
  }
};

// ✅ Update user
const updateUser = async (id, data) => {
  const client = await pool.connect();
  const query = `
    UPDATE users
    SET name = $1, role = $2, company = $3
    WHERE user_id = $5
    RETURNING user_id, name, email, company ,role
  `;
  const values = [data.name, data.role, data.company, parseInt(id)];

  try {
    const res = await client.query(query, values);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// ✅ Delete user
const deleteUser = async (id) => {
  const client = await pool.connect();
  const query = "DELETE FROM users WHERE user_id = $1 RETURNING *";

  try {
    const res = await client.query(query, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with ID ${id} not found.`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `User with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
