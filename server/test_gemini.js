import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  console.log("Checking API Key...");
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("FAIL: No GEMINI_API_KEY found in process.env");
    return;
  }
  console.log("Key found:", key.substring(0, 10) + "...");

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Sending request to Gemini...");
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("SUCCESS! Response:", response.text());
  } catch (err) {
    console.error("ERROR Calling Gemini:", err.message);
  }
}

test();
