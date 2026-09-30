const { connectDB } = require("../db/db");

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get all tasks by user_id
const getTasksByUserId = async (userId) => {
  const currentDate = new Date().toISOString().split("T")[0];

  const client = await connectDB();
  const text = `
    SELECT
      t.task_id,
      t.title,
      t.description,
      t.status,
      t.time_duration,
      t.start_date,
      t.end_date,
      t.created_date,
      t.project_id,
      p.name AS project_name,
      u.user_id,
      u.name AS user_name
  FROM tasks t
  JOIN task_assignments ta
      ON ta.task_id = t.task_id
  JOIN users u
      ON u.user_id = ta.user_id
  JOIN projects p
      ON p.project_id = t.project_id
  WHERE ta.user_id = $1
    AND t.start_date <= $2
    AND t.end_date >= $2;
  `;

  try {
    const res = await client.query(text, [userId, currentDate]);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getTasksByUserId,
};
