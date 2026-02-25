import { env } from './config/env.js';
import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import roadmapRoutes from './routes/roadmaps.js';
import postsRoutes from './routes/posts.js';

const app = express();
const server = http.createServer(app);
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agent', aiRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/posts', postsRoutes);

app.get('/', (req, res) => {
  res.send('EduAgent Enterprise API is running 🚀');
});

// Global Error Handler (Must be last)
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`Enterprise Server running on port ${PORT} [${env.NODE_ENV}]`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
