import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
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

export const updateModuleStatus = async (userId, roadmapId, phaseIdx, moduleIdx, status) => {
  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new Error('Roadmap not found');
  if (roadmap.userId.toString() !== userId) throw new Error('Unauthorized');

  const module = roadmap.phases[phaseIdx].modules[moduleIdx];
  const oldStatus = module.status;
  module.status = status;
  if (status === 'completed') {
    module.completedAt = new Date();
  }

  await roadmap.save();
  await cacheService.delete(`roadmaps:${userId}`);

  // Update User Stats
  if (status === 'completed' && oldStatus !== 'completed') {
    const user = await User.findById(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Streak Logic
    const lastDate = user.stats.lastCompletionDate ? new Date(user.stats.lastCompletionDate) : null;
    const lastDay = lastDate ? new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()) : null;

    const diffDays = lastDay ? Math.floor((today - lastDay) / (1000 * 60 * 60 * 24)) : null;

    if (diffDays === 0) {
      // Already completed something today
      user.stats.dailyCompletionCount += 1;
    } else if (diffDays === 1) {
      // Streak continues
      user.stats.currentStreak += 1;
      user.stats.dailyCompletionCount = 1;
    } else {
      // Streak broken (diffDays > 1) or first time (null)
      user.stats.currentStreak = 1;
      user.stats.dailyCompletionCount = 1;
    }

    user.stats.lastCompletionDate = now;
    if (user.stats.currentStreak > (user.stats.longestStreak || 0)) {
      user.stats.longestStreak = user.stats.currentStreak;
    }

    // Weekly Stats
    user.stats.weeklyStats.modulesCompleted += 1;
    user.stats.weeklyStats.timeInvested += (module.estimatedEffort || 30);

    // XP and Level
    user.stats.xp += 50;
    if (user.stats.xp >= user.stats.level * 500) {
      user.stats.level += 1;
    }

    // Milestone Checks
    const milestones = [];
    if (user.stats.currentStreak === 7) milestones.push('7_DAY_STREAK');
    if (user.stats.currentStreak === 30) milestones.push('30_DAY_STREAK');

    const allModules = roadmap.phases.flatMap(p => p.modules);
    const completedCount = allModules.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / allModules.length) * 100);

    if (progress === 25) milestones.push('25_PERCENT');
    if (progress === 50) milestones.push('50_PERCENT');
    if (progress === 100) milestones.push('100_PERCENT');

    await user.save();
    return { roadmap, milestones, userStats: user.stats };
  }

  return { roadmap };
};
