import { env } from './env.js';

export const aiConfig = {
  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-1.5-flash"
  },
  groq: {
    apiKey: env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile"
  },
  voice: {
    elevenLabsApiKey: env.ELEVENLABS_API_KEY,
    defaultVoiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel
  }
};
