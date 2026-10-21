import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

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

const response = await client.beta.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
  system: "You are Travel planner, a friendly travel planner for students. Costs are in rupees.",
  messages: [
    { role: "user", content: "Plan a 2-day trip to Goa with a budget of ₹6000." }
  ],
  output_config: {
    format: { type: "json_schema", schema: tripSchema },
  },
});

const textBlock = response.content.find((block) => block.type === "text");
const plan = JSON.parse(textBlock.text);

console.log("Trip:", plan.title);
console.log("Total cost: ₹" + plan.total_cost);
console.log("Number of days:", plan.days.length);
console.log("Day 1 food:", plan.days[0].food);
console.log("Day 2 title:", plan.days[1].title);
console.log("");
console.log("Full data:", plan);