const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// 🛠️ FIX 1: Updated relative paths (added ../) because this file lives inside the /api folder
const authMiddleware = require("./middleware/authMiddleware");
const { loggerMiddleware } = require("./middleware/logger.js");

const app = express();

// ✅ Body parser
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5186",
    "https://doneitweb.netlify.app",
    "https://doneitapp.netlify.app",
    "https://doneit.online",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🛠️ FIX 2: Updated relative paths for all your route files
const task = require("./routes/tasks");
const projectTasks = require("./routes/projectTasks");
const userProjects = require("./routes/userProjects");
const user = require("./routes/users");
const project = require("./routes/projects");
const userTasksRoute = require("./routes/userTasks");
const auth = require("./middleware/auth");
const authentication = require("./middleware/authentication");
const projectCollabRoutes = require("./routes/projectCollab");
const fetchCollabProjects = require("./routes/fetchCollabProjects");
const userEmailRoute = require("./routes/userEmail");
const passwordReset = require("./routes/passwordReset.js");
const userPasswordRoute = require("./routes/userPassword");
const projectActivityRoutes = require("./routes/projectActivity");
const taskAssignmentRoutes = require("./routes/taskAssignments");
const usercontact = require("./routes/contact");
const subscriptionRoutes = require("./routes/subscription");
const aboutRoute = require("./routes/about");
const chatbotRoute = require("./chatbot/chatRoute.js");

// ✅ Route mounts
app.use("/", aboutRoute);
app.use("/api", authentication);
app.use("/api/register", auth);
app.use("/api/password-reset", passwordReset);
app.use("/api/contact", usercontact);

app.use(authMiddleware);
app.use(loggerMiddleware);

app.use("/api/project", project);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/ai-assistant", chatbotRoute);
app.use("/project", userProjects);
app.use("/api/task", task);
app.use("/api/tasks", projectTasks);
app.use("/api/task-assignments", taskAssignmentRoutes);
app.use("/api/user", user);
app.use("/api/usertasks", userTasksRoute);
app.use("/api/userEmail", userEmailRoute);
app.use("/api/collab", projectCollabRoutes);
app.use("/api/collab-projects", fetchCollabProjects);
app.use("/api/user-password", userPasswordRoute);
app.use("/api/project-activity", projectActivityRoutes);

// Optional: Default root landing for health check
app.get("/", (req, res) => {
  res.send("🚀 DoneIt Serverless API is running smoothly!");
});

// 🛠️ FIX 3: Spin up the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
