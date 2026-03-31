import Whiteboard from '../models/Whiteboard.js';
import LearningData from '../models/LearningData.js';
import Roadmap from '../models/Roadmap.js';

export const saveWhiteboard = async (req, res) => {
  try {
    const { moduleTitle, elements } = req.body;
    
    const whiteboard = await Whiteboard.findOneAndUpdate(
      { userId: req.user.id, moduleTitle },
      { elements, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, whiteboard });
  } catch (error) {
    console.error('[Save Whiteboard Error]', error);
    res.status(500).json({ message: 'Failed to save whiteboard elements' });
  }
};

export const getWhiteboard = async (req, res) => {
  try {
    const { moduleTitle } = req.params;
    const whiteboard = await Whiteboard.findOne({ userId: req.user.id, moduleTitle });
    
    if (!whiteboard) {
      return res.json({ success: true, elements: [] });
    }
    
    res.json({ success: true, elements: whiteboard.elements });
  } catch (error) {
    console.error('[Get Whiteboard Error]', error);
    res.status(500).json({ message: 'Failed to fetch whiteboard data' });
  }
};

export const updateLearningProgress = async (req, res) => {
  try {
    const { moduleTitle, status, timeSpent, notesCount, completedAt, startedAt } = req.body;
    
    const update = {
      status,
      timeSpent,
      notesCount,
      updatedAt: Date.now()
    };
    
    if (completedAt) update.completedAt = completedAt;
    if (startedAt) update.startedAt = startedAt;
    
    const progress = await LearningData.findOneAndUpdate(
      { userId: req.user.id, moduleTitle },
      update,
      { new: true, upsert: true }
    );
    
    res.json({ success: true, progress });
  } catch (error) {
    console.error('[Update Progress Error]', error);
    res.status(500).json({ message: 'Failed to update learning progress' });
  }
};

export const getLearningProgress = async (req, res) => {
  try {
    const progress = await LearningData.find({ userId: req.user.id });
    res.json({ success: true, progress });
  } catch (error) {
    console.error('[Get Progress Error]', error);
    res.status(500).json({ message: 'Failed to fetch overall progress' });
  }
};
