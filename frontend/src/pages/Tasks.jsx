import { useState, useEffect, useCallback } from "react";
import {
  fetchTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI
} from "../services/api";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import "./Tasks.css";

function Tasks({ user, onOpenAuth }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
    priority: "medium"
  });

  // Delete Confirmation Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "success" });
  };

  // Load tasks on mount or when user/filters change
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await fetchTasksAPI({
        completed: filterStatus === "completed" ? "true" : (filterStatus === "pending" ? "false" : ""),
        priority: filterPriority,
        search
      });
      setTasks(data);
    } catch (err) {
      if (err.message === "401_UNAUTHORIZED") {
        showToast("Session expired or token invalid. Please log in again.", "error");
        onOpenAuth();
      } else {
        setError(err.message || "Failed to load tasks from server.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, filterStatus, filterPriority, search, onOpenAuth]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      completed: false,
      priority: "medium"
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    const id = task._id || task.id;
    setEditingTaskId(id);
    setFormData({
      title: task.title,
      description: task.description || "",
      completed: Boolean(task.completed),
      priority: task.priority || "medium"
    });
    setIsModalOpen(true);
  };

  // Submit Form (with Optimistic UI Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Title is required!", "error");
      return;
    }

    if (editingTaskId) {
      try {
        const updated = await updateTaskAPI(editingTaskId, formData);
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === editingTaskId ? updated : t))
        );
        setIsModalOpen(false);
        showToast("Task updated successfully in MongoDB!", "success");
      } catch (err) {
        if (err.message === "401_UNAUTHORIZED") {
          onOpenAuth();
        } else {
          showToast(err.message, "error");
        }
      }
    } else {
      // Optimistic UI update
      const tempId = `temp_${Date.now()}`;
      const optimisticTask = {
        _id: tempId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        completed: formData.completed,
        priority: formData.priority,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      setTasks((prev) => [optimisticTask, ...prev]);
      setIsModalOpen(false);

      try {
        const savedTask = await createTaskAPI(formData);
        setTasks((prev) =>
          prev.map((t) => (t._id === tempId ? savedTask : t))
        );
        showToast("Task created successfully in MongoDB!", "success");
      } catch (err) {
        setTasks((prev) => prev.filter((t) => t._id !== tempId));
        if (err.message === "401_UNAUTHORIZED") {
          showToast("Authentication required to create tasks.", "error");
          onOpenAuth();
        } else {
          showToast(`Failed to create task: ${err.message}`, "error");
        }
      }
    }
  };

  // Toggle Task Completion Status
  const toggleTaskStatus = async (task) => {
    const id = task._id || task.id;
    const newStatus = !task.completed;

    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === id ? { ...t, completed: newStatus } : t))
    );

    try {
      await updateTaskAPI(id, { completed: newStatus });
      showToast(`Task marked as ${newStatus ? "Completed" : "Pending"}!`, "info");
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...t, completed: !newStatus } : t))
      );
      if (err.message === "401_UNAUTHORIZED") {
        onOpenAuth();
      } else {
        showToast(`Failed to update status: ${err.message}`, "error");
      }
    }
  };

  // Delete Task
  const triggerDelete = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete._id || taskToDelete.id;

    try {
      await deleteTaskAPI(id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      showToast(`Task "${taskToDelete.title}" deleted from MongoDB!`, "info");
    } catch (err) {
      if (err.message === "401_UNAUTHORIZED") {
        onOpenAuth();
      } else {
        showToast(`Failed to delete: ${err.message}`, "error");
      }
    } finally {
      setTaskToDelete(null);
    }
  };

  return (
    <div className="tasks-page">
      <h1>Task Management System</h1>
      <p className="tasks-subtitle">
        Practical 7 &bull; JWT Authentication &amp; Express Middleware Pipeline
      </p>

      {/* Auth Status Banner */}
      {!user ? (
        <div className="auth-prompt-card">
          <div className="auth-prompt-icon">🔒</div>
          <h2>Authentication Required</h2>
          <p>
            All task routes are secured with <strong>JWT Authentication Middleware</strong>.
            Please log in or register to receive your Bearer token and access your tasks.
          </p>
          <button className="auth-prompt-btn" onClick={onOpenAuth}>
            Log In / Register
          </button>
        </div>
      ) : (
        <>
          <div className="auth-user-banner">
            <span>
              Logged in as: <strong>{user.name}</strong> ({user.email})
            </span>
            <span className="jwt-badge">JWT Secured 🔒</span>
          </div>

          {/* Stats Summary */}
          <div className="tasks-stats">
            <div className="stat-card">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total in MongoDB</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {tasks.filter((t) => t.completed).length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {tasks.filter((t) => !t.completed).length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {tasks.filter((t) => t.priority === "high").length}
              </span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>

          {/* Filter and Action Bar */}
          <div className="task-actions-bar">
            <input
              type="text"
              className="task-search-input"
              placeholder="Search tasks in database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="task-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="task-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button className="add-task-btn" onClick={openCreateModal}>
              + Add Task
            </button>
          </div>

          {/* Error or Loading */}
          {error && <ErrorMessage message={error} onRetry={loadTasks} />}

          {loading && !error && <Spinner />}

          {/* Task List */}
          {!loading && !error && (
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-tasks">
                  <h3>No tasks found in MongoDB</h3>
                  <p>Click "+ Add Task" to create a new task document.</p>
                </div>
              ) : (
                tasks.map((task) => {
                  const id = task._id || task.id;
                  return (
                    <div
                      key={id}
                      className={`task-item-card ${task.isOptimistic ? "optimistic-pulse" : ""}`}
                    >
                      <div className="task-header">
                        <h3>
                          {task.title}
                          {task.isOptimistic && <span className="saving-tag">Saving...</span>}
                        </h3>
                        <span className="task-id" title={`MongoDB ObjectId: ${id}`}>
                          ID: #{String(id).slice(-6)}
                        </span>
                      </div>
                      <p className="task-desc">{task.description || "No description provided."}</p>
                      <div className="task-footer">
                        <div className="task-tags">
                          <span className={`status-badge ${task.completed ? "completed" : "pending"}`}>
                            {task.completed ? "Completed" : "Pending"}
                          </span>
                          <span className={`priority-badge ${task.priority || "medium"}`}>
                            {task.priority || "medium"}
                          </span>
                          {task.createdAt && (
                            <span className="date-badge">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="task-btn-group">
                          <button
                            className="btn-status-toggle"
                            onClick={() => toggleTaskStatus(task)}
                            title="Toggle completed state"
                            disabled={task.isOptimistic}
                          >
                            {task.completed ? "Mark Pending" : "Mark Done"}
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => openEditModal(task)}
                            disabled={task.isOptimistic}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => triggerDelete(task)}
                            disabled={task.isOptimistic}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Create / Edit Modal */}
          {isModalOpen && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h2>{editingTaskId ? "Edit Task" : "Create Task in MongoDB"}</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-field">
                    <label>Title * (Required, server-validated)</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Implement JWT Auth Pipeline"
                    />
                  </div>

                  <div className="form-field">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Task details and notes..."
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label>Status</label>
                      <select
                        value={formData.completed ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({ ...formData, completed: e.target.value === "true" })
                        }
                      >
                        <option value="false">Pending</option>
                        <option value="true">Completed</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-buttons">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-save">
                      {editingTaskId ? "Save Changes" : "Save to MongoDB"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={Boolean(taskToDelete)}
            title="Delete Task Confirmation"
            message={
              taskToDelete
                ? `Are you sure you want to permanently delete "${taskToDelete.title}" from MongoDB?`
                : ""
            }
            onConfirm={confirmDelete}
            onCancel={() => setTaskToDelete(null)}
          />
        </>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
}

export default Tasks;
