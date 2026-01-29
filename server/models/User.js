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
    }]
  },
  stats: {
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    learningHours: { type: Number, default: 0 },
    badges: [{ type: String }] // Array of badge IDs/Names
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
