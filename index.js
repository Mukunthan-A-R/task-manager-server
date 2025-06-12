const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./db/db");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// ✅ CORS configuration to allow all origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5186",
    "https://doneitapp.netlify.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS middleware globally
app.use(cors(corsOptions));

// ✅ Handle preflight (OPTIONS) requests for all routes
app.options("*", cors(corsOptions));

// ✅ Body parser
app.use(express.json());

// ✅ DB connection
connectDB();

// ✅ Middleware and Routes
const task = require("./routes/tasks");
const projectTasks = require("./routes/projectTasks");
const userProjects = require("./routes/userProjects");
const user = require("./routes/users");
const project = require("./routes/projects");
const userTasksRoute = require("./routes/userTasks");
const auth = require("./middleware/auth");
const authorization = require("./middleware/authorization");
const projectCollabRoutes = require("./routes/projectCollab");
const fetchCollabProjects = require("./routes/fetchCollabProjects");
const userEmailRoute = require("./routes/userEmail");
const passwordReset = require("./routes/passwordReset.js");
const userPasswordRoute = require("./routes/userPassword");
const projectActivityRoutes = require("./routes/projectActivity");
const { loggerMiddleware } = require("./middleware/logger.js");

// ✅ Route mounts
app.use("/", authorization);
app.use("/api/register", auth);
app.use("/api/password-reset", passwordReset);
app.use(authMiddleware);
app.use(loggerMiddleware);

app.use("/api/project", project);
app.use("/project", userProjects);
app.use("/api/task", task);
app.use("/api/tasks", projectTasks);
app.use("/api/user", user);
app.use("/api/usertasks", userTasksRoute);
app.use("/api/userEmail", userEmailRoute);
app.use("/api/collab", projectCollabRoutes);
app.use("/api/collab-projects", fetchCollabProjects);
app.use("/api/user-password", userPasswordRoute);
app.use("/api/project-activity", projectActivityRoutes);

// ✅ Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
