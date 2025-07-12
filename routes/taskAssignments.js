const express = require("express");
const router = express.Router();

const {
  assignUserToTask,
  removeUserFromTask,
  getAssignedUsers,
  getAllAssignmentsByProject,
} = require("../models/taskAssignments");

<<<<<<< HEAD
=======
// Assign a user to a task
>>>>>>> main
router.post("/", async (req, res) => {
  const { task_id, user_id, assigned_by } = req.body;

  if (!task_id || !user_id || !assigned_by) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: task_id, user_id, assigned_by",
    });
  }

<<<<<<< HEAD
  const result = await assignUserToTask({ task_id, user_id, assigned_by });
  return res.status(result.status).json(result);
});

=======
  try {
    const result = await assignUserToTask({ task_id, user_id, assigned_by });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("POST /task-assignments error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Remove a user from a task
>>>>>>> main
router.delete("/", async (req, res) => {
  const { task_id, user_id } = req.body;

  if (!task_id || !user_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: task_id, user_id",
    });
  }

<<<<<<< HEAD
  const result = await removeUserFromTask({ task_id, user_id });
  return res.status(result.status).json(result);
});

router.get("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({
      success: false,
      message: "Missing taskId",
    });
  }

  const result = await getAssignedUsers(taskId);
  return res.status(result.status).json(result);
});

=======
  try {
    const result = await removeUserFromTask({ task_id, user_id });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("DELETE /task-assignments error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all assignments by project
>>>>>>> main
router.get("/project/:projectId", async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Missing projectId parameter",
    });
  }

<<<<<<< HEAD
  const result = await getAllAssignmentsByProject(projectId);
  return res.status(result.status).json(result);
=======
  try {
    const result = await getAllAssignmentsByProject(projectId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("GET /project/:projectId error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all users assigned to a specific task
router.get("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({
      success: false,
      message: "Missing taskId parameter",
    });
  }

  try {
    const result = await getAssignedUsers(taskId);
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("GET /:taskId error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
>>>>>>> main
});

module.exports = router;
