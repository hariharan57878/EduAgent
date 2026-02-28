import * as stewardService from '../services/stewardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  MOCK_DEMO_FOCUS,
  MOCK_DEMO_TRAJECTORY,
  MOCK_DEMO_STEWARD_DATA,
  MOCK_WEEKLY_REVIEW
} from '../config/demoData.js';

export const getSuggestions = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json(MOCK_DEMO_STEWARD_DATA);
  }
  const suggestions = await stewardService.analyzeWorkspace(req.user.id);
  res.json(suggestions);
});

export const getTodayFocus = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json(MOCK_DEMO_FOCUS);
  }
  const focus = await stewardService.generateTodayFocus(req.user.id);
  res.json(focus);
});

export const getTrajectorySummary = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json(MOCK_DEMO_TRAJECTORY);
  }
  const trajectory = await stewardService.generateTrajectorySummary(req.user.id);
  res.json(trajectory);
});

export const getWeeklyReview = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json(MOCK_WEEKLY_REVIEW);
  }
  const review = await stewardService.generateWeeklyReview(req.user.id);
  res.json(review);
});
