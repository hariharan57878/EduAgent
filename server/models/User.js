import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  passwordHash: {
    type: String,
    required: true
  },
  preferences: {
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'text', 'kinesthetic'],
      default: 'visual'
    },
    interests: [{
      type: String
    }],
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    weeklyAvailability: {
      type: Number, // Hours per week
      default: 5
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    targetOutcome: {
      type: String,
      enum: ['job', 'skill', 'certification', 'hobby'],
      default: 'skill'
    },
    targetRole: String,
    deadline: Date
  },
  stats: {
    streak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletionDate: { type: Date },
    dailyCompletionCount: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    learningHours: { type: Number, default: 0 },
    badges: [{ type: String }],
    weeklyStats: {
      modulesCompleted: { type: Number, default: 0 },
      timeInvested: { type: Number, default: 0 },
      lastReviewDate: { type: Date }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
