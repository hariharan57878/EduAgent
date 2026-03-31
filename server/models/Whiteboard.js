import mongoose from 'mongoose';

const whiteboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moduleTitle: {
    type: String,
    required: true
  },
  elements: [{
    id: String,
    type: { type: String },
    position: { x: Number, y: Number },
    size: { width: Number, height: Number },
    content: String,
    color: String,
    url: String,
    name: String,
    points: [{ x: Number, y: Number }],
    start: { x: Number, y: Number },
    end: { x: Number, y: Number },
    zIndex: { type: Number, default: 10 }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

whiteboardSchema.index({ userId: 1, moduleTitle: 1 }, { unique: true });

const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);
export default Whiteboard;
