// routes/projectCollab.js
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../models/projectCollab");

// ✅ GET all assignments
router.get("/", async (req, res) => {
  const data = await getAllAssignments();
  res.status(data.status).send(data);
});

// ✅ GET assignment by ID
router.get("/:id", async (req, res) => {
  const data = await getAssignmentById(req.params.id);
  res.status(data.status).send(data);
});

// ✅ POST create assignment
router.post("/", async (req, res) => {
  const { error } = validateAssignment(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const data = await createAssignment(req.body);
  res.status(data.status).send(data);
});

// ✅ PUT update assignment
router.put("/:id", async (req, res) => {
  const { error } = validateAssignmentUpdate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const data = await updateAssignment(req.params.id, req.body);
  res.status(data.status).send(data);
});

// ✅ DELETE assignment
router.delete("/:id", async (req, res) => {
  const data = await deleteAssignment(req.params.id);
  res.status(data.status).send(data);
});

// 🛡️ Validation Schemas
const assignmentSchema = Joi.object({
  user_id: Joi.number().required(),
  project_id: Joi.number().required(),
  role: Joi.string().valid("admin", "manager", "member", "client").required(),
  status: Joi.string().valid("pending", "accepted", "rejected").optional(),
});

const updateSchema = Joi.object({
  role: Joi.string().valid("admin", "manager", "member", "client").required(),
  status: Joi.string().valid("pending", "accepted", "rejected").required(),
});

function validateAssignment(data) {
  return assignmentSchema.validate(data);
}

function validateAssignmentUpdate(data) {
  return updateSchema.validate(data);
}

module.exports = router;
