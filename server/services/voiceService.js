import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const generateVoice = async (text, voiceId) => {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (ELEVENLABS_API_KEY) {
    const ELEVENLABS_VOICE_ID = voiceId || "21m00Tcm4TlvDq8ikWAM";
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
    return { data: response.data, contentType: 'audio/mpeg' };
  } else {
    // Fallback to Local Qwen TTS
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8000/tts',
      data: { text: text, speaker: 'Ryan' },
      responseType: 'arraybuffer'
    });
    return { data: response.data, contentType: 'audio/wav' };
  }
};
