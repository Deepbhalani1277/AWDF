import Task from '../models/Task.js';
import taskCache from '../utils/cache.js';
import taskEvents from '../events/taskEvents.js';

/**
 * Controller: Get all tasks from MongoDB (Practical 5 + Practical 9 In-Memory Caching)
 * GET /tasks
 * Supports in-memory caching via node-cache with 60s TTL
 * Returns X-Cache: HIT or MISS headers
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { completed, status, priority, search } = req.query;

    // Build unique cache key based on query filters
    const hasFilters = Object.keys(req.query).length > 0;
    const cacheKey = hasFilters ? `tasks_${JSON.stringify(req.query)}` : 'all_tasks';

    // 1. Check in-memory cache first
    const cached = taskCache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json({
        ...cached,
        source: 'in-memory-cache'
      });
    }

    // 2. Cache Miss: Query MongoDB
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    } else if (status) {
      if (status.toLowerCase() === 'completed') filter.completed = true;
      if (status.toLowerCase() === 'pending' || status.toLowerCase() === 'in-progress') filter.completed = false;
    }

    if (priority) {
      filter.priority = priority.toLowerCase();
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    const responsePayload = {
      success: true,
      count: tasks.length,
      data: tasks
    };

    // 3. Store in cache with 60-second TTL
    taskCache.set(cacheKey, responsePayload, 60);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({
      ...responsePayload,
      source: 'mongodb'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Get single task by ID from MongoDB (Practical 5 + Practical 9 Supplementary)
 * GET /tasks/:id
 * Caches individual task documents separately under `task_${id}`
 */
export const getTaskById = async (req, res, next) => {
  try {
    const taskId = req.taskId;
    const cacheKey = `task_${taskId}`;

    // 1. Check cache
    const cachedTask = taskCache.get(cacheKey);
    if (cachedTask) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json({
        ...cachedTask,
        source: 'in-memory-cache'
      });
    }

    // 2. Query MongoDB
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`
      });
    }

    const responsePayload = {
      success: true,
      data: task
    };

    // 3. Store in cache with 60-second TTL
    taskCache.set(cacheKey, responsePayload, 60);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({
      ...responsePayload,
      source: 'mongodb'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Create a new task in MongoDB (Practical 5, 9, 10)
 * POST /tasks
 * Practical 10: Responds immediately, then asynchronously emits 'task-created' event
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority, status } = req.body;

    const taskData = {
      title,
      description: description || '',
      completed: completed !== undefined ? Boolean(completed) : (status === 'completed'),
      priority: priority ? priority.toLowerCase() : 'medium'
    };

    const newTask = await Task.create(taskData);

    // Practical 9: Invalidate cache so stale data is never served
    taskCache.invalidateTasks();

    // Practical 10: Record API response timestamp and respond immediately
    const apiTimestamp = new Date().toISOString();
    console.log(`[API RESPONSE] POST /tasks 201 Sent at: ${apiTimestamp}`);

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: newTask,
      apiTimestamp
    });

    // Practical 10: Emit event asynchronously (non-blocking side-effect)
    taskEvents.emit('task-created', {
      task: newTask,
      user: req.user,
      apiTimestamp
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Update an existing task in MongoDB (Practical 5, 9, 10)
 * PUT /tasks/:id
 * Practical 10: Emits 'task-updated' event asynchronously
 */
export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.taskId;
    const updates = { ...req.body };

    if (updates.status !== undefined && updates.completed === undefined) {
      updates.completed = updates.status === 'completed';
    }

    if (updates.priority) {
      updates.priority = updates.priority.toLowerCase();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`
      });
    }

    // Practical 9: Invalidate cache for this item and all lists
    taskCache.invalidateTaskById(taskId);

    const apiTimestamp = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: updatedTask,
      apiTimestamp
    });

    // Practical 10: Emit 'task-updated' event
    taskEvents.emit('task-updated', {
      taskId,
      title: updatedTask.title,
      user: req.user,
      updates,
      apiTimestamp
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Delete a task from MongoDB (Practical 5, 9, 10)
 * DELETE /tasks/:id
 * Practical 10: Emits 'task-deleted' event asynchronously
 */
export const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`
      });
    }

    // Practical 9: Invalidate cache
    taskCache.invalidateTaskById(taskId);

    const apiTimestamp = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: deletedTask,
      apiTimestamp
    });

    // Practical 10: Emit 'task-deleted' event
    taskEvents.emit('task-deleted', {
      taskId,
      title: deletedTask.title,
      user: req.user,
      apiTimestamp
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Practical 9 Supplementary: Debug endpoint for cache metrics
 * GET /tasks/cache/stats
 */
export const getCacheStats = (req, res) => {
  res.status(200).json(taskCache.getStats());
};

/**
 * Practical 9 Supplementary: Flush cache endpoint
 * POST /tasks/cache/flush
 */
export const flushCache = (req, res) => {
  taskCache.flush();
  res.status(200).json({
    success: true,
    message: "In-memory cache flushed completely."
  });
};

/**
 * Practical 10 Supplementary: Background Event History inspection endpoint
 * GET /tasks/events/history
 */
export const getEventHistory = (req, res) => {
  res.status(200).json({
    success: true,
    count: taskEvents.getHistory().length,
    events: taskEvents.getHistory()
  });
};

/**
 * Controller: Trigger deliberate error to test global error handling middleware
 * GET /tasks/simulate/error
 */
export const simulateError = (req, res, next) => {
  try {
    throw new Error("Deliberate simulation error to test global error handling middleware.");
  } catch (err) {
    next(err);
  }
};

