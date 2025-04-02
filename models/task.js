// model/task.js
const { pool } = require("../db/db"); // Assuming pool is set up for DB connection

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get all tasks
const getAllTasks = async () => {
  const client = await pool.connect();
  const text = "SELECT * FROM tasks"; // Assuming tasks is the table name
  try {
    const res = await client.query(text);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Get a task by ID
const getTask = async (id) => {
  const client = await pool.connect();
  const text = "SELECT * FROM tasks WHERE task_id = $1";
  try {
    const res = await client.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Task with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Create a new task
const createTask = async (data) => {
  const client = await pool.connect();
  const text = `
    INSERT INTO tasks (title, description, time_duration, status, end_date, created)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [
    data.title,
    data.description,
    parseInt(data.time_duration),
    data.status,
    data.start_date,
    data.created,
  ];

  try {
    const res = await client.query(text, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Update an existing task
const updateTask = async (id, data) => {
  const client = await pool.connect();
  const text = `
    UPDATE tasks
    SET title = $1, description = $2, time_duration = $3, status = $4, end_date = $5, created = $6
    WHERE task_id = $7 RETURNING *;
  `;
  const values = [
    data.title,
    data.description,
    parseInt(data.time_duration),
    data.status,
    data.start_date,
    data.created,
    parseInt(id),
  ];

  try {
    const res = await client.query(text, values);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Task with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Delete a task by ID
const deleteTask = async (id) => {
  const client = await pool.connect();
  const text = "DELETE FROM tasks WHERE task_id = $1 RETURNING *";

  try {
    const res = await client.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Task with ID ${id} not found.`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `Task with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
