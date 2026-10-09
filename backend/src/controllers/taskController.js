import Task from '../models/Task.js';
import taskCache from '../utils/cache.js';

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
 * Controller: Create a new task in MongoDB (Practical 5 + Practical 9 Invalidation)
 * POST /tasks
 * Invalidates cached task lists upon creation
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

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: newTask
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Update an existing task in MongoDB (Practical 5 + Practical 9 Invalidation)
 * PUT /tasks/:id
 * Invalidates all list queries and specific task_${id} cache key
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

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Delete a task from MongoDB (Practical 5 + Practical 9 Invalidation)
 * DELETE /tasks/:id
 * Invalidates cache on deletion
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

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: deletedTask
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
