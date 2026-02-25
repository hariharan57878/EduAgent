import express from 'express';
import * as aiController from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-roadmap', auth, aiController.generateRoadmap);
router.post('/chat', auth, aiController.chat);
router.post('/generate-voice', auth, aiController.generateVoice);

export default router;
