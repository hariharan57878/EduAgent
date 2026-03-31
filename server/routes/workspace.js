import express from 'express';
import * as workspaceController from '../controllers/workspaceController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/whiteboard/save', auth, workspaceController.saveWhiteboard);
router.get('/whiteboard/:moduleTitle', auth, workspaceController.getWhiteboard);

router.post('/learning/update', auth, workspaceController.updateLearningProgress);
router.get('/learning/all', auth, workspaceController.getLearningProgress);

export default router;
