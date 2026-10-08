/**
 * In-memory storage for Task Management System (Practical 4)
 * Initialized with sample tasks for demonstration and lab evaluation.
 */

export let tasks = [
  {
    id: 1,
    title: "Setup Node.js and Express Server",
    description: "Initialize npm package and configure the Express server with essential middleware",
    status: "completed", // 'pending' | 'in-progress' | 'completed'
    priority: "high",     // 'low' | 'medium' | 'high'
    createdAt: "2026-08-24T09:00:00.000Z",
    updatedAt: "2026-08-24T09:30:00.000Z"
  },
  {
    id: 2,
    title: "Implement RESTful CRUD Endpoints",
    description: "Create GET /tasks, POST /tasks, PUT /tasks/:id, and DELETE /tasks/:id",
    status: "completed",
    priority: "high",
    createdAt: "2026-08-24T10:00:00.000Z",
    updatedAt: "2026-08-24T11:15:00.000Z"
  },
  {
    id: 3,
    title: "Configure Express Middleware Pipeline",
    description: "Integrate request logging, Content-Type validation, ID param validation, 404 handler, and global 500 error handler",
    status: "in-progress",
    priority: "high",
    createdAt: "2026-08-24T11:30:00.000Z",
    updatedAt: "2026-08-24T11:30:00.000Z"
  },
  {
    id: 4,
    title: "Test API with Postman & Automated Tests",
    description: "Verify all status codes (200, 201, 400, 404, 500) and edge cases with test suite",
    status: "pending",
    priority: "medium",
    createdAt: "2026-08-24T12:00:00.000Z",
    updatedAt: "2026-08-24T12:00:00.000Z"
  }
];

let nextId = 5;

export const getNextId = () => nextId++;

export const resetTasks = (initialTasks) => {
  if (initialTasks) {
    tasks = [...initialTasks];
  } else {
    tasks = [];
  }
};
