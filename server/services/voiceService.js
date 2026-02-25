import axios from 'axios';
import { aiConfig } from '../config/aiConfig.js';
import logger from '../utils/logger.js';

export const generateVoice = async (text, voiceId) => {
  const apiKey = aiConfig.voice.elevenLabsApiKey;

  if (apiKey) {
    logger.info('Using ElevenLabs for voice generation');
    const actualVoiceId = voiceId || aiConfig.voice.defaultVoiceId;
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`,
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      },
      responseType: 'arraybuffer'
    });
    return { data: response.data, contentType: 'audio/mpeg' };
  } else {
    logger.info('Using Local TTS fallback');
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8000/tts',
      data: { text: text, speaker: 'Ryan' },
      responseType: 'arraybuffer'
    });
    return { data: response.data, contentType: 'audio/wav' };
  }
};
