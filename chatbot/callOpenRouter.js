const quickPrompt = require("./prompts/quickPrompt");
const deepThinkPrompt = require("./prompts/deepThinkPrompt");

async function callOpenRouter({ mode, userMessage }) {
  const prompt = mode === "deep" ? deepThinkPrompt : quickPrompt;

  const model = "deepseek/deepseek-chat";

  const payload = {
    model,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: userMessage },
    ],
  };

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        "HTTP-Referer": "http://127.0.0.1:5500",
        "X-Title": "SandyAI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "No response.";
    return { success: true, reply };
  } catch (err) {
    console.error("OpenRouter error:", err.message);
    return { success: false, message: "AI API request failed." };
  }
}

module.exports = callOpenRouter;
