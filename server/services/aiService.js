import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const getGeminiResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found in env");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const getAIResponse = async (prompt) => {
  // Try Groq First
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content || "";
    } catch (err) {
      console.warn("Groq Error, falling back to Gemini:", err.message);
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      return await getGeminiResponse(prompt);
    } catch (err) {
      console.warn("Gemini Error:", err.message);
      throw err;
    }
  }

  throw new Error("No valid AI API Key found");
};

export const generateRoadmap = async (role, interests) => {
  const prompt = `
    Act as an expert educational curriculum designer. Create a detailed learning roadmap for the role: "${role}".
    User interests: ${interests ? interests.join(', ') : 'General'}.
    
    Return the response STRICTLY as a JSON object with this structure:
    {
      "title": "Roadmap Name",
      "role": "${role}",
      "description": "Brief description",
      "phases": [
        {
          "title": "Phase Name (e.g., Foundations)",
          "description": "Goal of this phase",
          "modules": [
            {
              "title": "Module Title",
              "type": "video/article/quiz",
              "contentUrl": "Search query for this topic", 
              "textContent": "Short summary of what to learn",
              "estimatedTime": "Time duration"
            }
          ]
        }
      ]
    }
    Do not include markdown backticks like \`\`\`json. Just the raw JSON string.
  `;

  const rawText = await getAIResponse(prompt);
  const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
};

export const getChatReply = async (message, context) => {
  const prompt = `You are EduAgent, a helpful AI learning assistant. Context: ${JSON.stringify(context || {})}. User says: ${message}`;
  return await getAIResponse(prompt);
};
