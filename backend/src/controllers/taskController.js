import Task from '../models/Task.js';

/**
 * Controller: Get all tasks from MongoDB (Practical 5)
 * GET /tasks
 * Supports query filters: ?completed=true&priority=high&search=keyword
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { completed, status, priority, search } = req.query;
    const filter = {};

    // Filter by completed status (supporting boolean param or 'completed' string status)
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    } else if (status) {
      if (status.toLowerCase() === 'completed') filter.completed = true;
      if (status.toLowerCase() === 'pending' || status.toLowerCase() === 'in-progress') filter.completed = false;
    }

    // Filter by priority enum
    if (priority) {
      filter.priority = priority.toLowerCase();
    }

    // Search keyword in title or description using case-insensitive regex
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Get single task by ID from MongoDB (Practical 5)
 * GET /tasks/:id
 * Supplementary Requirement: Returns 404 JSON response if task does not exist.
 */
export const getTaskById = async (req, res, next) => {
  try {
    const taskId = req.taskId;
    const task = await Task.findById(taskId);

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
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Create a new task in MongoDB (Practical 5)
 * POST /tasks
 * Triggers Mongoose schema validation and pre-save title trimming hook.
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
 * Controller: Update an existing task in MongoDB (Practical 5)
 * PUT /tasks/:id
 * Enforces schema validation using { runValidators: true }
 */
export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.taskId;
    const updates = { ...req.body };

    // Support status mapping to completed
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
 * Controller: Delete a task from MongoDB (Practical 5)
 * DELETE /tasks/:id
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
