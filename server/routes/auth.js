import express from 'express';
import * as authController from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.patch('/profile', auth, authController.updateProfile);

export default router;
