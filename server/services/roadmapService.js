import Roadmap from '../models/Roadmap.js';

export const getUserRoadmaps = async (userId) => {
  // TODO: Add Redis Cache Check
  // const cached = await redis.get(`roadmaps:${userId}`);
  // if (cached) return JSON.parse(cached);

  const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });

  // TODO: Set Redis Cache
  // await redis.set(`roadmaps:${userId}`, JSON.stringify(roadmaps), 'EX', 3600);

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
  return await newRoadmap.save();
};

export const deleteRoadmap = async (id) => {
  return await Roadmap.findByIdAndDelete(id);
};
