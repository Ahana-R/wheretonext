import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const destination = "Hampi";
const days = 2;
const budget = "Rs4000";

const response = await client.beta.messages.create({
    model : "claude-opus-5-5",
    max_tokens : 1000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: "You are a travel planner. Be friendly and suggest places to visit in one lines with budget.Also suggest local foods to try for every place!",
    messages:[
        {role:"user",content:`Plan a ${days} trip to ${destination} with budget of ${budget}.`}
    ],
});

const textBlock = response.content.find((block) => block.type === "text");
console.log(textBlock.text);
