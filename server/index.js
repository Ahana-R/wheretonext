import "dotenv/config";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic();

// The "form" we want Claude to fill in
const tripSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    total_cost: { type: "integer" },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          places: { type: "array", items: { type: "string" } },
          food: { type: "string" },
          cost: { type: "integer" },
        },
        required: ["day", "title", "places", "food", "cost"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "total_cost", "days"],
  additionalProperties: false,
};

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


app.get("/api/plan-stream", async (req, res) => {
  const { destination, days, budget } = req.query;

  if (!destination || !days) {
    return res.status(400).json({ error: "Please tell me a destination and number of days." });
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const stream = client.beta.messages.stream({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: "You are travel planner, a friendly travel planner for everyone. Keep answers short. For every place, mention one local food to try and a rough cost in rupees.",
      messages: [
        { role: "user", content: `Plan a ${days}-day trip to ${destination} with a budget of ₹${budget}.` }
      ],
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(event.delta.text);
      }
    }
  } catch (error) {
    console.error("AI error:", error.message);
    res.write("\n\nSorry, the trip planner is having trouble. Please try again.");
  }

  res.end();
});

app.get("/api/plan-cards", async (req, res) => {
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
      system: "You are travel planner, a friendly travel planner for everyone. Costs are in rupees. Keep the total within the budget.",
      messages: [
        { role: "user", content: `Plan a ${days}-day trip to ${destination} with a budget of ₹${budget}.` }
      ],
      output_config: {
        format: { type: "json_schema", schema: tripSchema },
      },
    });
  } catch (error) {
    console.error("AI error:", error.message);
    return res.status(500).json({ error: "Sorry, the trip planner is having trouble. Please try again." });
  }

  if (response.stop_reason !== "end_turn") {
    console.error("Unexpected stop reason:", response.stop_reason);
    return res.status(500).json({ error: "The plan didn't come out right. Please try again." });
  }

  const textBlock = response.content.find((block) => block.type === "text");
  const plan = JSON.parse(textBlock.text);

  res.json({ plan });
});


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});