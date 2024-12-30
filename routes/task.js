const express = require("express");
const router = express.Router();
const {
  CreateTask,
  GetTask,
  DeleteTask,
  updateTask,
} = require("../models/task");

router.get("/", async (req, res) => {
  const result = await GetTask();
  res.send(result);
});

router.post("/", async (req, res) => {
  const task = {
    name: "10 km RUN",
    description: "for fitness !",
    badge: "Important",
  };

  const result = await CreateTask(task);

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const tmp = {
    name: "Free RUN",
    description: "for timepass !",
  };

  const result = await updateTask(req.params.id, tmp);
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  console.log(req.params.id);

  const result = await DeleteTask(req.params.id);
  res.send(result);
});

module.exports = router;
