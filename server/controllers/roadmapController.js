import * as roadmapService from '../services/roadmapService.js';
import { validateSaveRoadmapInput } from '../dto/roadmap.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { MOCK_DEMO_ROADMAP } from '../config/demoData.js';

export const getMyRoadmaps = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json([MOCK_DEMO_ROADMAP]);
  }
  const roadmaps = await roadmapService.getUserRoadmaps(req.user.id);
  res.json(roadmaps);
});

export const getRoadmap = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json(MOCK_DEMO_ROADMAP);
  }
  const roadmap = await roadmapService.getRoadmapById(req.params.id);

  if (!roadmap) {
    const error = new Error('Roadmap not found');
    error.status = 404;
    throw error;
  }

  if (roadmap.userId.toString() !== req.user.id) {
    const error = new Error('Not authorized to access this roadmap');
    error.status = 401;
    throw error;
  }

  res.json(roadmap);
});

export const saveRoadmap = asyncHandler(async (req, res) => {
  const validatedData = validateSaveRoadmapInput(req.body);
  const roadmap = await roadmapService.createRoadmap(req.user.id, validatedData);
  res.json(roadmap);
});

export const removeRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.getRoadmapById(req.params.id);

  if (!roadmap) {
    const error = new Error('Roadmap not found');
    error.status = 404;
    throw error;
  }

  if (roadmap.userId.toString() !== req.user.id) {
    const error = new Error('User not authorized to delete this roadmap');
    error.status = 401;
    throw error;
  }

  await roadmapService.deleteRoadmap(req.params.id);
  res.json({ msg: 'Roadmap removed' });
});

export const updateModuleStatus = asyncHandler(async (req, res) => {
  const { phaseIdx, moduleIdx, status } = req.body;
  const result = await roadmapService.updateModuleStatus(
    req.user.id,
    req.params.id,
    phaseIdx,
    moduleIdx,
    status
  );
  res.json(result);
});
