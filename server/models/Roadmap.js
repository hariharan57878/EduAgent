import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['video', 'article', 'quiz', 'project', 'voice-interaction'],
    default: 'article'
  },
  contentUrl: String,
  textContent: String,
  estimatedTime: String, // Display string (e.g., "15 mins")
  estimatedEffort: Number, // Minutes for tracking
  timeSpent: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  completedAt: Date,
  notes: String,
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }]
});

const phaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  modules: [moduleSchema]
});

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  description: String,
  phases: [phaseSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  viewPreference: {
    type: String,
    enum: ['timeline', 'kanban'],
    default: 'timeline'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
