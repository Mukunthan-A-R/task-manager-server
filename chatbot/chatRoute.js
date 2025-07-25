const express = require("express");
const router = express.Router();
const callOpenRouter = require("./callOpenRouter");

router.post("/", async (req, res) => {
  try {
    const result = await callOpenRouter(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("LLM Error:", err);
    res.status(500).json({ error: "LLM call failed" });
  }
});

module.exports = router;
