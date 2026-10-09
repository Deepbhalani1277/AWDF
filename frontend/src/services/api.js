/**
 * Central API Service - Practical 6: Full Stack Integration
 * Defines centralized helper functions for interacting with the Express/MongoDB backend.
 */

// Base backend API URL
const BASE_URL = 'http://localhost:5000/api/tasks';

/**
 * Fetch all tasks from MongoDB with optional query parameters
 * @param {Object} params - { completed, priority, search }
 */
export const fetchTasksAPI = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.completed !== undefined && params.completed !== '') {
    query.append('completed', params.completed);
  }
  if (params.priority) {
    query.append('priority', params.priority);
  }
  if (params.search) {
    query.append('search', params.search);
  }

  const url = query.toString() ? `${BASE_URL}?${query.toString()}` : BASE_URL;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch tasks from server');
  }
  return data.data;
};

/**
 * Fetch single task by ID
 * @param {string} id - MongoDB ObjectId
 */
export const getTaskByIdAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Task with ID ${id} not found`);
  }
  return data.data;
};

/**
 * Create a new task in MongoDB
 * @param {Object} taskData - { title, description, completed, priority }
 */
export const createTaskAPI = async (taskData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.messages ? data.messages.join(', ') : (data.error || 'Failed to create task');
    throw new Error(errorMsg);
  }
  return data.data;
};

/**
 * Update an existing task in MongoDB
 * @param {string} id - MongoDB ObjectId
 * @param {Object} updates - Fields to update
 */
export const updateTaskAPI = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.messages ? data.messages.join(', ') : (data.error || 'Failed to update task');
    throw new Error(errorMsg);
  }
  return data.data;
};

/**
 * Delete a task from MongoDB
 * @param {string} id - MongoDB ObjectId
 */
export const deleteTaskAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete task');
  }
  return data.data;
};
