import Roadmap from '../models/Roadmap.js';
import logger from '../utils/logger.js';

/**
 * Steward Engine Logic Structure:
 * 1. Fetch user workspace data (Roadmaps).
 * 2. Apply rules (Inactivity, Overload, Struggle, etc.).
 * 3. Generate suggestion objects.
 */

export const analyzeWorkspace = async (userId) => {
  const roadmaps = await Roadmap.find({ userId, status: 'active' });
  const suggestions = [];

  for (const roadmap of roadmaps) {
    const roadmapSuggestions = await processRoadmapRules(roadmap);
    suggestions.push(...roadmapSuggestions);
  }

  return suggestions;
};

const processRoadmapRules = async (roadmap) => {
  const suggestions = [];
  const now = new Date();

  // Rule 1: Inactivity Detection
  const lastUpdate = new Date(roadmap.updatedAt);
  const daysInactive = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

  if (daysInactive >= 3) {
    suggestions.push({
      type: 'INACTIVITY',
      priority: 'high',
      message: `You haven't made progress on "${roadmap.title}" for ${daysInactive} days.`,
      action: 'Suggest a 15-minute micro-task to regain momentum.'
    });
  }

  // Flatten modules for analysis
  const allModules = roadmap.phases.flatMap(p => p.modules);
  const inProgressModules = allModules.filter(m => m.status === 'in-progress');
  const completedModules = allModules.filter(m => m.status === 'completed');

  // Rule 2: Overload Detection (Simple version for now)
  if (inProgressModules.length > 3) {
    suggestions.push({
      type: 'OVERLOAD',
      priority: 'medium',
      message: `You have ${inProgressModules.length} modules in progress. You might be spreading yourself too thin.`,
      action: 'Suggest focusing on completing one module before starting the next.'
    });
  }

  // Rule 3: Completion Acceleration
  const totalModules = allModules.length;
  if (totalModules > 0 && completedModules.length / totalModules >= 0.8 && completedModules.length < totalModules) {
    suggestions.push({
      type: 'COMPLETION_ACCELERATION',
      priority: 'high',
      message: `You are 80% through "${roadmap.title}"! Only a few steps left to mastery.`,
      action: 'Nudge to prioritize final modules.'
    });
  }

  // Rule 4: Struggle Detection (Based on updatedAt if we added it to module, but we didn't, using roadmap for now)
  // In a real app, we'd track timestamp per module status change.
  // For this scope, we simulate it.
  inProgressModules.forEach(module => {
    // If we had a 'startedAt' on module, we could check it here.
  });

  return suggestions;
};
