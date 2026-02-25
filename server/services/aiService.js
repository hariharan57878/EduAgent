import { getGeminiCompletion } from './ai/geminiProvider.js';
import { getGroqCompletion } from './ai/groqProvider.js';
import { aiConfig } from '../config/aiConfig.js';
import logger from '../utils/logger.js';

export const getAIResponse = async (prompt) => {
  // Try Groq First
  if (aiConfig.groq.apiKey) {
    try {
      logger.info('Using Groq Provider');
      return await getGroqCompletion(prompt);
    } catch (err) {
      logger.warn('Groq failed, falling back to Gemini');
    }
  }

  // Fallback to Gemini
  if (aiConfig.gemini.apiKey) {
    try {
      logger.info('Using Gemini Provider');
      return await getGeminiCompletion(prompt);
    } catch (err) {
      logger.error('Gemini Provider critical failure');
      throw err;
    }
  }

  throw new Error("No AI providers configured or available");
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
          "title": "Phase Name",
          "description": "Goal",
          "modules": [
            {
              "title": "Module Title",
              "type": "video/article/quiz",
              "contentUrl": "Search query", 
              "textContent": "Summary",
              "estimatedTime": "15 mins"
            }
          ]
        }
      ]
    }
    No markdown backticks.
  `;

  const rawText = await getAIResponse(prompt);
  const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
};

export const getChatReply = async (message, context) => {
  const prompt = `You are EduAgent, a helpful AI learning assistant. Context: ${JSON.stringify(context || {})}. User says: ${message}`;
  return await getAIResponse(prompt);
};
