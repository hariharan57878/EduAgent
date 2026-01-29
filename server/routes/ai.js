import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import auth from '../middleware/auth.js';

const router = express.Router();

const getGeminiResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found in env");
  console.log("Using API Key:", process.env.GEMINI_API_KEY.substring(0, 5) + "...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Generate Roadmap
router.post('/generate-roadmap', auth, async (req, res) => {
  try {
    const { role, interests } = req.body;

    // Construct Prompt
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

    console.log("Generating roadmap for:", role);
    const rawText = await getGeminiResponse(prompt);
    console.log("Gemini Raw Response:", rawText);

    // Clean up if markdown exists
    const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const roadmapData = JSON.parse(jsonStr);

    res.json(roadmapData);

  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ message: 'AI Generation Failed', error: err.message });
  }
});

// Chat with Agent
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    // Simple chat for now using Gemini
    const prompt = `Context: ${JSON.stringify(context || {})}. User says: ${message}`;
    const reply = await getGeminiResponse(prompt);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI Chat Failed' });
  }
});

export default router;
