const express = require("express");
const router = express.Router();
const { hasProjectAccess } = require("../models/projectAccess");
const { pool } = require("../db/db");

// Helper to send consistent response
const sendResponse = (res, status, success, message, data = null) => {
  res.status(status).json({
    status,
    success,
    message,
    data,
  });
};

router.get("/:id", async (req, res) => {
  const projectId = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    const accessGranted = await hasProjectAccess(userId, projectId);
    if (!accessGranted) {
      return sendResponse(res, 403, false, "Access denied");
    }

    const result = await pool.query(
      "SELECT * FROM tasks WHERE project_id = $1",
      [projectId]
    );

    if (result.rows.length > 0) {
      sendResponse(res, 200, true, "Tasks fetched successfully", result.rows);
    } else {
      sendResponse(res, 404, false, "No tasks found for this project ID");
    }
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Internal server error");
  }
});

module.exports = router;
