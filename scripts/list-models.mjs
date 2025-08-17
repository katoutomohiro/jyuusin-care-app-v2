import 'dotenv/config';
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const res = await client.models.list();
console.log(res.data.map(m => m.id).slice(0, 20));
