const express = require("express");
const cors = require("cors"); // Import CORS middleware
const app = express();

// Import Routes and Middleware
const task = require("./routes/tasks");
const projectTasks = require("./routes/projectTasks");
const project = require("./routes/projects");
const auth = require("./middleware/auth");
const authorization = require("./middleware/authorization");
const { pool, connectDB, disconnectDB } = require("./db/db");

// Enable CORS for specific origin (your frontend URL)
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests only from your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type"], // Specify allowed headers (e.g., Content-Type)
};

// Use CORS middleware
app.use(cors(corsOptions));

connectDB(); // Connect to the database
app.use(express.json()); // Middleware to parse JSON request bodies

// Routes
app.use("/api/register", auth);
app.use("/api/project", project);
app.use("/api/task", task); // Add the task route
app.use("/api/tasks", projectTasks);

// Set the port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
