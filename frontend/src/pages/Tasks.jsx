import { useState, useEffect } from "react";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
    priority: "medium"
  });

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/tasks");
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTasks(data.data);
      } else {
        throw new Error("Invalid response format from Express API.");
      }
    } catch (err) {
      setError(`Cannot connect to Express backend: ${err.message}. Ensure backend is running on port 5000 and MongoDB is connected.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Validation Error: Title is required!");
      return;
    }

    try {
      const url = editingTaskId ? `/tasks/${editingTaskId}` : "/tasks";
      const method = editingTaskId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setIsModalOpen(false);
        fetchTasks();
      } else {
        alert(result.error || (result.messages && result.messages.join(", ")) || "Failed to save task.");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const toggleTaskStatus = async (task) => {
    const id = task._id || task.id;
    try {
      const res = await fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const deleteTask = async (task) => {
    const id = task._id || task.id;
    if (!window.confirm(`Are you sure you want to delete task "${task.title}"?`)) return;

    try {
      const res = await fetch(`/tasks/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    
    let matchesStatus = true;
    if (filterStatus === "completed") matchesStatus = t.completed === true;
    if (filterStatus === "pending") matchesStatus = t.completed === false;

    const matchesPriority = !filterPriority || t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="tasks-page">
      <h1>Task Management System</h1>
      <p className="tasks-subtitle">
        Practical 5 &bull; MongoDB Database Integration &amp; Mongoose Schema Validation
      </p>

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
      {error && (
        <div className="backend-alert error">
          <p>{error}</p>
          <button onClick={fetchTasks} className="retry-btn">Retry Connection</button>
        </div>
      )}

      {loading && !error && (
        <p className="loading-text">Fetching tasks from MongoDB...</p>
      )}

      {/* Task List */}
      {!loading && !error && (
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-tasks">
              <h3>No tasks found in MongoDB</h3>
              <p>Click "+ Add Task" to insert a new document with schema validation.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const id = task._id || task.id;
              return (
                <div key={id} className="task-item-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
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
                      >
                        {task.completed ? "Mark Pending" : "Mark Done"}
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => openEditModal(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteTask(task)}
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

      {/* Task Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{editingTaskId ? `Edit Task` : "Create Task in MongoDB"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-field">
                <label>Title * (Required, whitespace auto-trimmed)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Test Mongoose Schema Validation"
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
                    onChange={(e) => setFormData({ ...formData, completed: e.target.value === "true" })}
                  >
                    <option value="false">Pending</option>
                    <option value="true">Completed</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Priority (Enum: low, medium, high)</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
    </div>
  );
}

export default Tasks;
