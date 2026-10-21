import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens:16000,
    betas:["server-side-fallback-2026-07-01"],
    fallbacks:"default",
    messages:[
        {role:"user",content:"Write a short story (about 100 words) about train journey to Darjeeling."}
    ],
});

for await (const event of stream) {
    if (event.type == "content_block_delta" && event.delta.type === "text_delta"){
        process.stdout.write(event.delta.text);
    }
}