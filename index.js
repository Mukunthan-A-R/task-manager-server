const express = require("express");
const cors = require("cors");
const app = express();

// Import Routes and Middleware
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
const { pool, connectDB, disconnectDB } = require("./db/db");

// ✅ Updated CORS Configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       "http://localhost:5173", // Dev
//       "https://doneittask.netlify.app", // Production
//       "https://doneittask.netlify.app/dashboard",
//       "https://doneittask.netlify.app/tasks",
//       "https://doneittask.netlify.app/graph",
//       "https://doneittask.netlify.app/analytics",
//     ];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type"],
//   credentials: true, // optional: allow cookies/credentials if needed
// };

// Use CORS middleware
app.use(cors({}));

// DB connection and middleware
connectDB();
app.use(express.json()); // JSON body parser

// API Routes
app.use("/", authorization);
app.use("/api/register", auth);
app.use("/api/project", project);
app.use("/project", userProjects);
app.use("/api/task", task);
app.use("/api/tasks", projectTasks);
app.use("/api/user", user);
app.use("/api/usertasks", userTasksRoute);
app.use("/api/userEmail", userEmailRoute);
app.use("/api/collab", projectCollabRoutes);
app.use("/api/collab-projects", fetchCollabProjects);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
