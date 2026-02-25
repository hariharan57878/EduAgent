import * as aiService from '../services/aiService.js';
import * as voiceService from '../services/voiceService.js';

export const generateRoadmap = async (req, res) => {
  try {
    const { role, interests } = req.body;
    const roadmapData = await aiService.generateRoadmap(role, interests);
    res.json(roadmapData);
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ message: 'AI Generation Failed', error: err.message });
  }
};

export const chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    const reply = await aiService.getChatReply(message, context);
    res.json({ reply });
  } catch (err) {
    console.error("[Chat] Error:", err.message);
    res.status(500).json({ message: 'AI Chat Failed', error: err.message });
  }
};

export const generateVoice = async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const { data, contentType } = await voiceService.generateVoice(text, voiceId);
    res.set('Content-Type', contentType);
    res.send(data);
  } catch (err) {
    console.error("Voice Generation Error:", err.message);
    res.status(500).json({ message: 'Voice Generation Failed', error: err.message });
  }
};
