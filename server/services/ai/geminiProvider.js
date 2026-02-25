import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiConfig } from '../../config/aiConfig.js';
import logger from '../../utils/logger.js';

export const getGeminiCompletion = async (prompt) => {
  try {
    const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: aiConfig.gemini.model });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini Provider Error:', error.message);
    throw error;
  }
};
