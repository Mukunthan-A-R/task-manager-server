// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../models/task"); // Importing the model functions

// Get all tasks
router.get("/", async (req, res) => {
  const data = await getAllTasks();
  res.status(data.status).send(data);
});

// Get a task by ID
router.get("/:id", async (req, res) => {
  const data = await getTask(req.params.id);
  res.status(data.status).send(data);
});

// Create a new task
router.post("/", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = await createTask(req.body);
  res.status(data.status).send(data);
});

// Update an existing task
router.put("/:id", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = await updateTask(req.params.id, req.body);
  res.status(data.status).send(data);
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
  const data = await deleteTask(req.params.id);
  res.status(data.status).send(data);
});

// Task Schema using Joi for validation
const taskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(255).required(),
  time_duration: Joi.number().min(1).max(10000).required(),
  status: Joi.string().valid("pending", "in-progress", "completed").required(),
  start_date: Joi.date().required(),
  created: Joi.date().required(),
});

// Function to validate the task data using Joi
function validateTask(data) {
  return taskSchema.validate(data);
}

module.exports = router;
