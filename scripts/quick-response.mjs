import 'dotenv/config';
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const out = await client.responses.create({
  model: "gpt-4o-mini",
  input: "Say hello from jyuusin-care-app-v2",
});
console.log(out.output_text);
