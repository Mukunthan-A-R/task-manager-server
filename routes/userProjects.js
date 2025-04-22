const express = require("express");
const router = express.Router();
const { pool } = require("../db/db");

router.get("/:id", async (req, res) => {
  const projectId = parseInt(req.params.id);

  try {
    // Query the database to get tasks for the specific project
    const result = await pool.query(
      "SELECT * FROM projects WHERE created = $1",
      [projectId]
    );

    // If tasks are found, return them; otherwise, send a 404 not found
    if (result.rows.length > 0) {
      res.status(200).json({
        status: 200,
        data: result.rows,
        message: "Projects Retrived successfully",
      });
    } else {
      res.status(404).json({
        data: [],
        status: 404,
        message: "No Project found for this project ID",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
