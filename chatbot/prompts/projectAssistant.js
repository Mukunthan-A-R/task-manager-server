const { getProject } = require("../../models/projects");
const { fetchTasksByProjectId } = require("../../models/projectTasks");

/**
 * Generates a context-aware prompt for the project assistant.
 * Fetches project and tasks from backend, then structures them for AI usage.
 * @param {string} projectId - The ID of the project to fetch data for.
 * @returns {Promise<string>} - A formatted prompt string.
 */
async function generateProjectPrompt(projectId) {
  try {
    // Fetch project details
    const project = await getProject(projectId);

    // Fetch tasks for this project
    const tasks = await fetchTasksByProjectId(projectId);

    // Structure project details
    const projectInfo = `
Project Title: ${project.title}
Description: ${project.description || "No description provided"}
Status: ${project.status}
Start Date: ${project.start_date}
End Date: ${project.end_date || "Ongoing"}
    `.trim();

    // Structure tasks details
    let taskDetails = "No tasks found for this project.";
    if (tasks && tasks.length > 0) {
      taskDetails = tasks
        .map(
          (task, index) => `
${index + 1}. ${task.title}
   - Status: ${task.status}
   - Description: ${task.description || "No description"}
   - Assigned To: ${task.assigned_to?.name || "Unassigned"}
   - Due Date: ${task.due_date || "Not set"}
`
        )
        .join("\n");
    }

    // Final prompt
    const prompt = `
You are an AI assistant that helps users understand and manage their project.
Here is the project and task data fetched from the backend:

${projectInfo}

Tasks:
${taskDetails}

Use this information to answer any questions, suggest improvements, or summarize project status.
    `.trim();

    return prompt;
  } catch (error) {
    console.error("Error generating project prompt:", error);
    return "Error: Could not fetch project or task details.";
  }
}

module.exports = { generateProjectPrompt };
