const express = require("express");
const task = require("./routes/task");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Just a get request");
  res.send("Hi guys");
});

app.use("/api/task", task);

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
