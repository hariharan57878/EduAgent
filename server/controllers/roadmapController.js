import * as roadmapService from '../services/roadmapService.js';

export const getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapService.getUserRoadmaps(req.user.id);
    res.json(roadmaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.getRoadmapById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const saveRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.createRoadmap(req.user.id, req.body);
    res.json(roadmap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const removeRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.getRoadmapById(req.params.id);
    if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });
    if (roadmap.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await roadmapService.deleteRoadmap(req.params.id);
    res.json({ msg: 'Roadmap removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
