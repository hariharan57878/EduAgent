import express from 'express';
import * as postController from '../controllers/postController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, postController.getRecentPosts);
router.post('/', auth, postController.addNewPost);

export default router;
