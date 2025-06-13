const express = require("express");
const router = express.Router();
const { connectDB, disconnectDB } = require("../db/db");

router.get("/:id", async (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  if (isNaN(projectId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid project ID provided.",
    });
  }
  const client = await connectDB();
  try {
    const result = await client.query(
      "SELECT * FROM projects WHERE created = $1 order by start_date",
      [projectId],
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
  } finally {
    client.release();
    disconnectDB();
  }
});

module.exports = router;
