import 'dotenv/config';
import Groq from 'groq-sdk';

async function test() {
  console.log("Checking Groq API Key...");
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error("FAIL: No GROQ_API_KEY found in process.env");
    return;
  }
  // Be careful not to expose the full key in logs
  console.log("Key found:", key.substring(0, 10) + "...");

  try {
    const groq = new Groq({ apiKey: key });
    console.log("Sending request to Groq (llama-3.3-70b-versatile)...");
    // Using a very basic prompt to test connectivity
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello, just checking if you are online." }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 50, // Keep it short and cheap
    });

    const response = completion.choices[0]?.message?.content || "";
    console.log("SUCCESS! Response:", response);

  } catch (err) {
    console.error("ERROR Calling Groq:", err.message);
    if (err.message.includes("401")) {
      console.error("--> Usually means Invalid API Key.");
    }
  }
}

test();
