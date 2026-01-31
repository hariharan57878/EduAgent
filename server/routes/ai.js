import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import axios from 'axios';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js';

dotenv.config(); // Force load .env


const router = express.Router();

const getGeminiResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found in env");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

const getAIResponse = async (prompt) => {
  // Try Groq First (as requested)
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("Using Groq API");
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content || "";
    } catch (err) {
      console.warn("Groq Error, falling back to Gemini (if available):", err.message);
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Using Gemini API (Fallback)");
      return await getGeminiResponse(prompt);
    } catch (err) {
      console.warn("Gemini Error:", err.message);
    }
  }

  throw new Error("No valid AI API Key found (GROQ_API_KEY or GEMINI_API_KEY)");
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
    const rawText = await getAIResponse(prompt);
    console.log("AI Raw Response:", rawText);

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
// Chat with Agent
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    console.log(`[Chat] Received: "${message}"`);
    console.log(`[Chat] Context: ${JSON.stringify(context || {})}`);

    // Check key availability
    // Check key availability
    if (process.env.GROQ_API_KEY) console.log(`[Chat] Using Groq Key: ${process.env.GROQ_API_KEY.substring(0, 5)}...`);
    else if (process.env.GEMINI_API_KEY) console.log(`[Chat] Using Gemini Key: ${process.env.GEMINI_API_KEY.substring(0, 5)}...`);
    else console.warn("[Chat] No AI API keys found!");

    const prompt = `You are EduAgent, a helpful AI learning assistant. Context: ${JSON.stringify(context || {})}. User says: ${message}`;
    const reply = await getAIResponse(prompt);

    console.log(`[Chat] Reply Length: ${reply.length} chars`);
    res.json({ reply });

  } catch (err) {
    console.error("[Chat] Error:", err.message);
    console.error(err.stack); // Full stack trace
    res.status(500).json({
      message: 'AI Chat Failed',
      error: err.message,
      provider: process.env.GROQ_API_KEY ? 'groq' : 'gemini'
    });
  }
});

// Generate Voice (ElevenLabs)
// Generate Voice (Qwen Local)
// Generate Voice (ElevenLabs with Fallback)
router.post('/generate-voice', auth, async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Check for API Keys
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    if (ELEVENLABS_API_KEY) {
      console.log(`[Voice] Using ElevenLabs API...`);
      const ELEVENLABS_VOICE_ID = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel

      try {
        const response = await axios({
          method: 'post',
          url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          data: {
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          },
          responseType: 'arraybuffer'
        });

        console.log(`[Voice] ElevenLabs Success! Size: ${response.data.length}`);
        res.set('Content-Type', 'audio/mpeg');
        return res.send(response.data);

      } catch (elevenErr) {
        console.error("[Voice] ElevenLabs Failed:", elevenErr.message);
        // Fallback logic below if needed, or just throw
        throw elevenErr;
      }
    } else {
      // Fallback to Local Qwen if no ElevenLabs key
      console.log(`[Voice] No ElevenLabs Key. Delegating to Local Qwen TTS...`);
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/tts',
        data: { text: text, speaker: 'Ryan' },
        responseType: 'arraybuffer'
      });
      res.set('Content-Type', 'audio/wav');
      res.send(response.data);
    }

  } catch (err) {
    console.error("Voice Generation Error:", err.message);
    res.status(500).json({ message: 'Voice Generation Failed', error: err.message });
  }
});

export default router;
