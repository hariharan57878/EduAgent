import express from 'express';
import Roadmap from '../models/Roadmap.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all roadmaps for user
router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get specific roadmap
router.get('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create/Save a roadmap
router.post('/', auth, async (req, res) => {
  try {
    // Expects full roadmap object from AI generation
    const { title, role, description, phases } = req.body;

    const newRoadmap = new Roadmap({
      userId: req.user.id,
      title,
      role,
      description,
      phases
    });

    const roadmap = await newRoadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
