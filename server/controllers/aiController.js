import * as aiService from '../services/aiService.js';
import * as voiceService from '../services/voiceService.js';
import { validateRoadmapInput } from '../dto/roadmap.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateRoadmap = asyncHandler(async (req, res) => {
  const validatedData = validateRoadmapInput(req.body);
  const roadmapData = await aiService.generateRoadmap(validatedData.role, validatedData.interests);
  res.json(roadmapData);
});

export const chat = asyncHandler(async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    const error = new Error('Message is required');
    error.status = 400;
    throw error;
  }

  const reply = await aiService.getChatReply(message, context);
  res.json({ reply });
});

export const generateVoice = asyncHandler(async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text) {
    const error = new Error('Text is required');
    error.status = 400;
    throw error;
  }

  const { data, contentType } = await voiceService.generateVoice(text, voiceId);
  res.set('Content-Type', contentType);
  res.send(data);
});
