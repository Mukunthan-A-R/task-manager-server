const express = require("express");
const router = express.Router();
const { pool } = require("../db/db");

// Helper for consistent response format
const sendResponse = (res, status, success, data = null) => {
  res.status(status).json({
    success,
    status,
    data,
  });
};

// Get all projects created by a specific user (user_id passed as :id)
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE created = $1",
      [userId]
    );

    if (result.rows.length > 0) {
      sendResponse(res, 200, true, result.rows);
    } else {
      sendResponse(res, 404, false, []);
    }
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, []);
  }
});

module.exports = router;
