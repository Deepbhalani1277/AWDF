import { tasks, getNextId } from '../data/tasks.js';

/**
 * Controller: Get all tasks
 * GET /tasks
 * Supports optional query parameters: ?status=completed&priority=high&search=keyword
 */
export const getAllTasks = (req, res) => {
  let result = [...tasks];
  const { status, priority, search } = req.query;

  if (status) {
    result = result.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  if (priority) {
    result = result.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const query = search.toLowerCase();
    result = result.filter(t => 
      t.title.toLowerCase().includes(query) || 
      (t.description && t.description.toLowerCase().includes(query))
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
};

/**
 * Controller: Get single task by ID
 * GET /tasks/:id
 */
export const getTaskById = (req, res) => {
  const taskId = req.taskId; // extracted & validated by validateTaskId middleware
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${taskId} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

/**
 * Controller: Create a new task
 * POST /tasks
 */
export const createTask = (req, res) => {
  const { title, description, status, priority } = req.body;

  // Validation: title is required
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Error: 'title' is required and must be a non-empty string."
    });
  }

  // Allowed enum values
  const validStatuses = ['pending', 'in-progress', 'completed'];
  const validPriorities = ['low', 'medium', 'high'];

  const normalizedStatus = status && validStatuses.includes(status.toLowerCase()) 
    ? status.toLowerCase() 
    : 'pending';

  const normalizedPriority = priority && validPriorities.includes(priority.toLowerCase()) 
    ? priority.toLowerCase() 
    : 'medium';

  const now = new Date().toISOString();
  const newTask = {
    id: getNextId(),
    title: title.trim(),
    description: description ? description.trim() : '',
    status: normalizedStatus,
    priority: normalizedPriority,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: newTask
  });
};

/**
 * Controller: Update an existing task
 * PUT /tasks/:id
 */
export const updateTask = (req, res) => {
  const taskId = req.taskId;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${taskId} not found.`
    });
  }

  const { title, description, status, priority } = req.body;

  const validStatuses = ['pending', 'in-progress', 'completed'];
  const validPriorities = ['low', 'medium', 'high'];

  const existingTask = tasks[taskIndex];

  // Update properties if supplied
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Validation Error: 'title' cannot be an empty string."
      });
    }
    existingTask.title = title.trim();
  }

  if (description !== undefined) {
    existingTask.description = typeof description === 'string' ? description.trim() : '';
  }

  if (status !== undefined) {
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values are: ${validStatuses.join(', ')}`
      });
    }
    existingTask.status = status.toLowerCase();
  }

  if (priority !== undefined) {
    if (!validPriorities.includes(priority.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid priority. Allowed values are: ${validPriorities.join(', ')}`
      });
    }
    existingTask.priority = priority.toLowerCase();
  }

  existingTask.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: existingTask
  });
};

/**
 * Controller: Delete a task
 * DELETE /tasks/:id
 */
export const deleteTask = (req, res) => {
  const taskId = req.taskId;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${taskId} not found.`
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
    data: deletedTask
  });
};

/**
 * Controller: Trigger deliberate error to test global error handling middleware
 * GET /tasks/simulate/error
 */
export const simulateError = (req, res, next) => {
  try {
    throw new Error("Deliberate simulation error to test global 500 error handling middleware.");
  } catch (err) {
    next(err);
  }
};
