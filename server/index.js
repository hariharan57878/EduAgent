import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import roadmapRoutes from './routes/roadmaps.js';
import postsRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agent', aiRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/posts', postsRoutes);

app.get('/', (req, res) => {
  res.send('EduAgent API is running');
});

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.log("Database connection failed, starting server anyway for testing...");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (DB Failed)`);
  });
});
