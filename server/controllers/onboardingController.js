import * as aiService from '../services/aiService.js';
import * as roadmapService from '../services/roadmapService.js';
import * as authService from '../services/authService.js';
import { validateProfileUpdate } from '../dto/user.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const completeOnboarding = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wizardData = validateProfileUpdate(req.body);

  logger.info(`Starting atomic onboarding for user: ${userId}`);

  try {
    // 1. Generate Roadmap (AI Call)
    // We call aiService.generateRoadmap which expects the wizardData profile
    const roadmapData = await aiService.generateRoadmap(wizardData);

    // 2. Save Roadmap to DB
    const savedRoadmap = await roadmapService.createRoadmap(userId, roadmapData);

    // 3. Update User Profile & Mark Onboarding Complete
    // We only reach this if AI and saving succeed.
    await authService.updateProfile(userId, {
      ...wizardData,
      onboardingCompleted: true
    });

    logger.info(`Atomic onboarding successful for user: ${userId}`);

    res.json({
      success: true,
      roadmap: savedRoadmap,
      msg: "Onboarding completed successfully"
    });
  } catch (error) {
    logger.error(`Atomic onboarding FAILED for user: ${userId}`, error.message);

    // Pass to global error handler
    // Onboarding remains incomplete because updateProfile was never called.
    throw error;
  }
});
