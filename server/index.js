import dotenv from 'dotenv';
dotenv.config({ override: true });

import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import roadmapRoutes from './routes/roadmaps.js';
import postsRoutes from './routes/posts.js';

const app = express();
const server = http.createServer(app);
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
  res.send('EduAgent API is running with Clean Architecture 🚀');
});

// Future WebSocket Integration Support
// const io = new Server(server);
// io.on('connection', (socket) => { ... });

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB Connection Failed)`);
    });
  }
};

startServer();
