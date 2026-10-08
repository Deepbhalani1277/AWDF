import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './src/routes/taskRoutes.js';
import { requestLogger } from './src/middleware/logger.js';
import { notFoundHandler } from './src/middleware/notFoundHandler.js';
import { globalErrorHandler } from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Core Built-in & Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve Interactive Testing Dashboard (Static Assets)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Custom Request Logging Middleware (Global)
app.use(requestLogger);

// 4. Mount REST API Routes
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// 5. 404 Undefined Route Handler (Supplementary Requirement)
app.use(notFoundHandler);

// 6. Centralized Global Error Handler (Must be defined last with 4 arguments)
app.use(globalErrorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

export default app;
