import Roadmap from '../models/Roadmap.js';
import { cacheService } from './cacheService.js';
import logger from '../utils/logger.js';

export const getUserRoadmaps = async (userId) => {
  const cacheKey = `roadmaps:${userId}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    logger.info(`Returning cached roadmaps for user: ${userId}`);
    return cached;
  }

  const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });

  await cacheService.set(cacheKey, roadmaps, 300); // Cache for 5 mins
  return roadmaps;
};

export const getRoadmapById = async (id) => {
  return await Roadmap.findById(id);
};

export const createRoadmap = async (userId, roadmapData) => {
  const { title, role, description, phases } = roadmapData;
  const newRoadmap = new Roadmap({
    userId,
    title,
    role,
    description,
    phases
  });

  const saved = await newRoadmap.save();
  await cacheService.delete(`roadmaps:${userId}`); // Invalidate cache
  return saved;
};

export const deleteRoadmap = async (id) => {
  const roadmap = await Roadmap.findById(id);
  const result = await Roadmap.findByIdAndDelete(id);
  if (roadmap) {
    await cacheService.delete(`roadmaps:${roadmap.userId}`); // Invalidate cache
  }
  return result;
};
