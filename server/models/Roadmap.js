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
  contentUrl: String, // Link to video or resource
  textContent: String, // Markdown content
  estimatedTime: String, // e.g., "15 mins"
  completed: {
    type: Boolean,
    default: false
  },
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
