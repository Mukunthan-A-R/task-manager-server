const { connectDB } = require("../db/db");

const handleError = (err) => ({
  success: false,
  status: 500,
  error: err.message || "An unexpected error occurred",
});

const assignUserToTask = async ({ task_id, user_id, assigned_by }) => {
  const client = await connectDB();

  try {
    const taskRes = await client.query(
      `SELECT project_id FROM tasks WHERE task_id = $1`,
      [task_id]
    );

    if (taskRes.rowCount === 0) {
      return { success: false, status: 404, message: "Task not found" };
    }

    const project_id = taskRes.rows[0].project_id;

    const checkRes = await client.query(
      `SELECT role FROM project_assignments WHERE project_id = $1 AND user_id = $2`,
      [project_id, user_id]
    );

    if (checkRes.rowCount === 0) {
      return {
        success: false,
        status: 403,
        message: "User is not a member of the project",
      };
    }

    const userRole = checkRes.rows[0].role;
    if (userRole === "client") {
      return {
        success: false,
        status: 403,
        message: "Clients cannot be assigned to tasks",
      };
    }

    const insertRes = await client.query(
      `INSERT INTO task_assignments (task_id, user_id, assigned_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (task_id, user_id) DO NOTHING
       RETURNING *`,
      [task_id, user_id, assigned_by]
    );

    return {
      success: true,
      status: 201,
      data: insertRes.rows[0] || {},
      message:
        insertRes.rowCount > 0
          ? "Assignment created"
          : "Assignment already exists",
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

const removeUserFromTask = async ({ task_id, user_id }) => {
  const client = await connectDB();

  const query = `
    DELETE FROM task_assignments
    WHERE task_id = $1 AND user_id = $2
    RETURNING *
  `;

  try {
    const res = await client.query(query, [task_id, user_id]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: "Assignment not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Assignment removed",
      data: res.rows[0],
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

const getAssignedUsers = async (taskId) => {
  const client = await connectDB();

  const query = `
    SELECT u.user_id, u.name, u.email
    FROM task_assignments ta
    JOIN users u ON ta.user_id = u.user_id
    WHERE ta.task_id = $1
  `;

  try {
    const res = await client.query(query, [parseInt(taskId)]);
    return {
      success: true,
      status: 200,
      data: res.rows,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

const getAllAssignmentsByProject = async (projectId) => {
  const client = await connectDB();

  const query = `
    SELECT 
      ta.task_id,
      ta.user_id,
      u.name AS user_name,
      u.email AS user_email
    FROM task_assignments ta
    JOIN tasks t ON ta.task_id = t.task_id
    JOIN users u ON ta.user_id = u.user_id
    WHERE t.project_id = $1
    ORDER BY ta.task_id, u.name;
  `;

  try {
    const res = await client.query(query, [parseInt(projectId)]);
    return {
      success: true,
      status: 200,
      data: res.rows,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  assignUserToTask,
  removeUserFromTask,
  getAssignedUsers,
  getAllAssignmentsByProject,
};
