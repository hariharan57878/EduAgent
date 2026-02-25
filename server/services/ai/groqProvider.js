import Groq from 'groq-sdk';
import { aiConfig } from '../../config/aiConfig.js';
import logger from '../../utils/logger.js';

export const getGroqCompletion = async (prompt) => {
  try {
    const groq = new Groq({ apiKey: aiConfig.groq.apiKey });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: aiConfig.groq.model,
      temperature: 0.7,
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    logger.error('Groq Provider Error:', error.message);
    throw error;
  }
};
