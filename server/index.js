import "dotenv/config";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcome to Where-to-next! Where do you want to go? ✈️" });
});

app.get("/api/plan", async (req, res) => {
  const { destination, days, budget } = req.query;
  if (!destination || !days) {
    return res.status(400).json({ error: "Please tell me a destination and number of days." });
  }

    let response;
  try {
    response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: "You are Yatra, a friendly travel planner for students. Keep answers short. For every place, mention one local food to try and a rough cost in rupees.",
      messages: [
        { role: "user", content: `Plan a ${days}-day trip to ${destination} with a budget of ₹${budget}.` }
      ],
    });
  } catch (error) {
    console.error("AI error:", error.message);
    return res.status(500).json({ error: "Sorry, the trip planner is having trouble. Please try again." });
  }

  console.log("Stop reason:", response.stop_reason);

  const textBlock = response.content.find((block) => block.type === "text");

  if (textBlock) {
    res.json({ plan: textBlock.text });
  } else {
    res.json({ error: "No plan came back. Please try again." });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});