const express = require("express");
const router = express.Router();
const callOpenRouter = require("./callOpenRouter");

router.post("/:id", async (req, res) => {
  try {
    // console.log(req.body);

    const result = await callOpenRouter(req.body, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error("LLM Error:", err);
    res.status(500).json({ error: "LLM call failed" });
  }
});

module.exports = router;
