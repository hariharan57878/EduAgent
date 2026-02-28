import express from 'express';
import * as roadmapController from '../controllers/roadmapController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, roadmapController.getMyRoadmaps);
router.get('/:id', auth, roadmapController.getRoadmap);
router.post('/', auth, roadmapController.saveRoadmap);
router.patch('/:id/modules', auth, roadmapController.updateModuleStatus);
router.delete('/:id', auth, roadmapController.removeRoadmap);

export default router;
