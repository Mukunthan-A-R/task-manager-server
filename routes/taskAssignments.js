const express = require("express");
const router = express.Router();

const {
  assignUserToTask,
  removeUserFromTask,
  getAssignedUsers,
  getAllAssignmentsByProject,
} = require("../models/taskAssignments");

router.post("/", async (req, res) => {
  const { task_id, user_id, assigned_by } = req.body;

  if (!task_id || !user_id || !assigned_by) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: task_id, user_id, assigned_by",
    });
  }

  const result = await assignUserToTask({ task_id, user_id, assigned_by });
  return res.status(result.status).json(result);
});

router.delete("/", async (req, res) => {
  const { task_id, user_id } = req.body;

  if (!task_id || !user_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: task_id, user_id",
    });
  }

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

router.get("/project/:projectId", async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Missing projectId parameter",
    });
  }

  const result = await getAllAssignmentsByProject(projectId);
  return res.status(result.status).json(result);
});

module.exports = router;
