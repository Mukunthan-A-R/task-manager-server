const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost")
  .then(() => console.log("Server Connected"))
  .catch((err) => {
    console.log("Server Disconnected");
    console.log("Error :", err);
  });

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  badge: String,
});

const Task = mongoose.model("Task", taskSchema);

async function CreateTask(task) {
  const taskData = new Task(task);
  try {
    const data = await taskData.save();
    return data;
  } catch (err) {
    return err;
  }
}

async function GetTask() {
  try {
    const data = await Task.find();
    return data;
  } catch (err) {
    return err;
  }
}

async function updateTask(id, data) {
  try {
    const val = await Task.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    );
    return val;
  } catch (err) {
    return err;
  }
}

async function DeleteTask(id) {
  try {
    const data = await Task.findOneAndDelete({ _id: id });
    console.log(data);

    return data;
  } catch (err) {
    return err;
  }
}

const task = {
  name: "Budget Meeting",
  description: "board of meeting",
  badge: "Important",
};

module.exports = { CreateTask, GetTask, DeleteTask, updateTask };
