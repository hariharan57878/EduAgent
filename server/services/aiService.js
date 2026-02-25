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

export const generateRoadmap = async (profile) => {
  const { targetRole, experienceLevel, weeklyAvailability, targetOutcome, learningStyle, deadline } = profile;

  const prompt = `
    Act as the EduAgent Learning Steward (Learning Operations Manager). 
    Your mission: "Stop starting over. Start finishing."
    
    Create a structured, execution-ready learning roadmap for: "${targetRole}".
    User Profile:
    - Experience Level: ${experienceLevel}
    - Weekly Availability: ${weeklyAvailability} hours/week
    - Target Outcome: ${targetOutcome}
    - Preferred Learning Style: ${learningStyle}
    - Target Deadline: ${deadline || 'Flexible'}

    Requirements:
    1. Do NOT teach concepts. Generate a management timeline.
    2. Structure phases that realistically fit the ${weeklyAvailability} hours/week constraint.
    3. For a ${experienceLevel} level, adjust the complexity and foundational steps.
    4. Provide high-quality external search queries for each module.

    Return the response STRICTLY as a JSON object with this structure:
    {
      "title": "${targetRole} Master Plan",
      "role": "${targetRole}",
      "description": "High-precision execution path for ${targetRole} (${experienceLevel})",
      "phases": [
        {
          "title": "Phase Name",
          "description": "Phase objective",
          "modules": [
            {
              "title": "Module Title",
              "type": "video/article/project",
              "contentUrl": "Optimized search query", 
              "textContent": "Operational objective: What to complete",
              "estimatedTime": "approx time string",
              "estimatedEffort": 60 // Minutes (integer)
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
