import mongoose from 'mongoose';

const learningDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moduleTitle: {
    type: String,
    required: true
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap'
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  notesCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  startedAt: Date,
  completedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

learningDataSchema.index({ userId: 1, moduleTitle: 1 }, { unique: true });

const LearningData = mongoose.model('LearningData', learningDataSchema);
export default LearningData;
