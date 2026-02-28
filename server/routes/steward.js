import express from 'express';
import * as stewardController from '../controllers/stewardController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/suggestions', auth, stewardController.getSuggestions);
router.get('/today-focus', auth, stewardController.getTodayFocus);
router.get('/trajectory', auth, stewardController.getTrajectorySummary);
router.get('/weekly-review', auth, stewardController.getWeeklyReview);

export default router;
