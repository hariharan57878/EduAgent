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
    Act as an expert Learning Operations Manager. Create a structured execution workspace for the role: "${role}".
    User interests: ${interests ? interests.join(', ') : 'General'}.
    
    The roadmap must be an execution timeline focused on mastery and completion.
    "Stop starting over. Start finishing."

    Return the response STRICTLY as a JSON object with this structure:
    {
      "title": "Roadmap Name",
      "role": "${role}",
      "description": "Structured execution path for ${role}",
      "phases": [
        {
          "title": "Phase Name (e.g., Tactical Foundations)",
          "description": "Execution goal for this phase",
          "modules": [
            {
              "title": "Module Title",
              "type": "video/article/project",
              "contentUrl": "Optimized search query for high-quality resources", 
              "textContent": "Operational objective: What must be completed",
              "estimatedTime": "45 mins",
              "estimatedEffort": 45
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
  const systemPrompt = `
    You are the EduAgent Learning Steward. You are a Learning Operations Manager, not a tutor.
    Your mission: "Stop starting over. Start finishing."
    
    Rules:
    - You do NOT teach concepts. 
    - You do NOT provide long-form academic explanations.
    - You manage execution and momentum.
    - Assist in decision-making, roadmap optimization, and providing guidance on next steps.
    - If a user asks to learn something, point them to their workspace or suggest a high-quality resource.
    - Focus on structure, tracking, and completion.
  `;
  const prompt = `${systemPrompt}\nContext: ${JSON.stringify(context || {})}.\nUser says: ${message}`;
  return await getAIResponse(prompt);
};
