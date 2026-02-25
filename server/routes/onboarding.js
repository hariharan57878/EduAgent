import express from 'express';
import * as onboardingController from '../controllers/onboardingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/complete', auth, onboardingController.completeOnboarding);

export default router;
