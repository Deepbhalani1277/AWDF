import mongoose from 'mongoose';

/**
 * Task Schema Definition - Practical 5
 * Enforces schema constraints, default values, priority enum, and pre-save hooks.
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Supplementary Requirement: Pre-save hook to automatically trim whitespace from the title field
taskSchema.pre('save', function (next) {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  if (typeof next === 'function') next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
