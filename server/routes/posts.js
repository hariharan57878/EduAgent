import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get recent posts (optionally filtered by channel)
router.get('/', auth, async (req, res) => {
  try {
    const { channel } = req.query;
    const filter = channel ? { channel } : {};

    // Get last 50 posts
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { channel, content } = req.body;

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username || 'Anonymous', // Ideally fetch user to get latest name
      channel,
      content
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
