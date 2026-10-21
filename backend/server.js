import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import { requestLogger } from './src/middleware/logger.js';
import { notFoundHandler } from './src/middleware/notFoundHandler.js';
import { globalErrorHandler } from './src/middleware/errorHandler.js';

// Practical 10: Initialize Event-Driven Architecture Listeners
import './src/events/taskListeners.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

// 1. Core Built-in & Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve Interactive Testing Dashboard (Static Assets)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Custom Request Logging Middleware (Global)
app.use(requestLogger);

// Health check endpoint for CI/CD and Container monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// 4. Mount REST API Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// 5. 404 Undefined Route Handler
app.use(notFoundHandler);

// 6. Centralized Global Error Handler
app.use(globalErrorHandler);

// MongoDB Database Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected successfully to ${MONGO_URI}`);
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

export default app;
