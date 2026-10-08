/**
 * Practical 5: MongoDB & Mongoose Schema API Client / Test Bench
 * Author: Deep Bhalani
 * Institute: Charotar University of Science and Technology - CSE
 */

const API_BASE = '/tasks';

// State
let tasksList = [];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const tabPages = document.querySelectorAll('.tab-page');

const goToTasksBtn = document.getElementById('goToTasksBtn');
const goToTesterBtn = document.getElementById('goToTesterBtn');

const tasksContainer = document.getElementById('tasksContainer');
const taskSearchInput = document.getElementById('taskSearchInput');
const filterStatusSelect = document.getElementById('filterStatusSelect');
const filterPrioritySelect = document.getElementById('filterPrioritySelect');
const taskCountText = document.getElementById('taskCountText');
const openNewTaskBtn = document.getElementById('openNewTaskBtn');

// Modal Elements
const taskModalOverlay = document.getElementById('taskModalOverlay');
const modalTaskForm = document.getElementById('modalTaskForm');
const modalHeading = document.getElementById('modalHeading');
const modalTaskId = document.getElementById('modalTaskId');
const modalTaskTitle = document.getElementById('modalTaskTitle');
const modalTaskDesc = document.getElementById('modalTaskDesc');
const modalTaskStatus = document.getElementById('modalTaskStatus');
const modalTaskPriority = document.getElementById('modalTaskPriority');
const modalCancelBtn = document.getElementById('modalCancelBtn');

// Tester Elements
const testStatusPill = document.getElementById('testStatusPill');
const testTimePill = document.getElementById('testTimePill');
const testUrlLabel = document.getElementById('testUrlLabel');
const testJsonOutput = document.getElementById('testJsonOutput');
const testCallButtons = document.querySelectorAll('.test-call-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  fetchTasks();
  initEventListeners();
  initTester();
});

// Tab Switcher
function switchTab(tabName) {
  navLinks.forEach(link => {
    if (link.getAttribute('data-tab') === tabName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  tabPages.forEach(page => {
    if (page.id === `tab-${tabName}`) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initTabs() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  if (goToTasksBtn) {
    goToTasksBtn.addEventListener('click', () => switchTab('tasks'));
  }
  if (goToTesterBtn) {
    goToTesterBtn.addEventListener('click', () => switchTab('tester'));
  }
}

// Fetch Tasks
async function fetchTasks() {
  try {
    const res = await fetch(API_BASE);
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      tasksList = result.data;
      renderTasks();
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasksContainer.innerHTML = `
      <div class="box" style="border-left-color: #ef4444; text-align: center;">
        <h2 style="color: #ef4444;">Server / MongoDB Connection Error</h2>
        <p>Could not load tasks from MongoDB backend. Ensure Express and MongoDB are running.</p>
      </div>
    `;
    taskCountText.textContent = 'Server / DB offline';
  }
}

// Render Tasks
function renderTasks() {
  const searchTerm = (taskSearchInput.value || '').toLowerCase().trim();
  const selectedStatus = filterStatusSelect.value;
  const selectedPriority = filterPrioritySelect.value;

  const filtered = tasksList.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                          (task.description && task.description.toLowerCase().includes(searchTerm));
    
    let matchesStatus = true;
    if (selectedStatus === 'completed') matchesStatus = task.completed === true;
    if (selectedStatus === 'pending') matchesStatus = task.completed === false;

    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  taskCountText.textContent = `Showing ${filtered.length} of ${tasksList.length} documents in MongoDB`;

  if (filtered.length === 0) {
    tasksContainer.innerHTML = `
      <div class="box" style="text-align: center; margin-top: 20px;">
        <h2>No Tasks Found in MongoDB</h2>
        <p>No tasks match your filter. Click "+ Add New Task" to insert a document with Mongoose.</p>
      </div>
    `;
    return;
  }

  tasksContainer.innerHTML = filtered.map(task => {
    const id = task._id || task.id;
    return `
      <div class="repo-card">
        <div class="repo-card-header">
          <h2>${escapeHtml(task.title)}</h2>
          <span style="font-size: 12px; color: #64748b; font-weight: bold;" title="MongoDB ObjectId">
            ObjectId: #${String(id).slice(-6)}
          </span>
        </div>
        <p>${escapeHtml(task.description || 'No description provided.')}</p>
        
        <div class="repo-card-footer">
          <div class="card-badges">
            <span class="tag ${task.completed ? 'completed' : 'pending'}">
              ${task.completed ? 'completed' : 'pending'}
            </span>
            <span class="tag priority">${task.priority || 'medium'} priority</span>
          </div>
          <div>
            <button class="card-btn" onclick="toggleTaskStatus('${id}')" title="Toggle Completed">
              ${task.completed ? 'Mark Pending' : 'Mark Done'}
            </button>
            <button class="card-btn" onclick="openEditModal('${id}')">Edit</button>
            <button class="card-btn delete" onclick="deleteTask('${id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Event Listeners
function initEventListeners() {
  taskSearchInput.addEventListener('input', renderTasks);
  filterStatusSelect.addEventListener('change', renderTasks);
  filterPrioritySelect.addEventListener('change', renderTasks);

  openNewTaskBtn.addEventListener('click', () => {
    modalHeading.textContent = 'Add New Task in MongoDB';
    modalTaskId.value = '';
    modalTaskForm.reset();
    modalTaskPriority.value = 'medium';
    modalTaskStatus.value = 'pending';
    taskModalOverlay.classList.add('active');
  });

  modalCancelBtn.addEventListener('click', () => {
    taskModalOverlay.classList.remove('active');
  });

  modalTaskForm.addEventListener('submit', handleTaskSubmit);
}

// Handle Form Submit (Create / Edit)
async function handleTaskSubmit(e) {
  e.preventDefault();
  const id = modalTaskId.value;
  const isEditing = Boolean(id);

  const payload = {
    title: modalTaskTitle.value,
    description: modalTaskDesc.value,
    completed: modalTaskStatus.value === 'completed',
    priority: modalTaskPriority.value
  };

  try {
    const url = isEditing ? `${API_BASE}/${id}` : API_BASE;
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok && result.success) {
      taskModalOverlay.classList.remove('active');
      await fetchTasks();
    } else {
      const errorMsg = result.error || (result.messages && result.messages.join('\n')) || "Failed to save task.";
      alert(errorMsg);
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
}

// Open Edit Modal
window.openEditModal = function(id) {
  const task = tasksList.find(t => (t._id || t.id) === id);
  if (!task) return;

  modalHeading.textContent = `Edit Task Document`;
  modalTaskId.value = id;
  modalTaskTitle.value = task.title;
  modalTaskDesc.value = task.description || '';
  modalTaskStatus.value = task.completed ? 'completed' : 'pending';
  modalTaskPriority.value = task.priority || 'medium';

  taskModalOverlay.classList.add('active');
};

// Toggle Next Status
window.toggleTaskStatus = async function(id) {
  const task = tasksList.find(t => (t._id || t.id) === id);
  if (!task) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });

    if (res.ok) {
      await fetchTasks();
    }
  } catch (err) {
    console.error("Status toggle error:", err);
  }
};

// Delete Task
window.deleteTask = async function(id) {
  if (!confirm(`Are you sure you want to delete this document from MongoDB?`)) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      await fetchTasks();
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// API & Middleware Tester (Practical 5)
// ==========================================
function initTester() {
  testCallButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      executeTest(action);
    });
  });
}

async function executeTest(action) {
  let url = API_BASE;
  let method = 'GET';
  let headers = {};
  let body = null;

  const firstTaskId = tasksList.length > 0 ? (tasksList[0]._id || tasksList[0].id) : '507f1f77bcf86cd799439011';

  switch (action) {
    case 'getAll':
      url = '/tasks';
      method = 'GET';
      break;

    case 'getSingle':
      url = `/tasks/${firstTaskId}`;
      method = 'GET';
      break;

    case 'createSample':
      url = '/tasks';
      method = 'POST';
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({
        title: "  MongoDB & Mongoose Validation Task  ", // Leading/trailing space to test pre-save hook
        description: "Task with pre-save whitespace trimming and high priority enum",
        completed: false,
        priority: "high"
      });
      break;

    case 'updateSample':
      url = `/tasks/${firstTaskId}`;
      method = 'PUT';
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({
        completed: true,
        priority: "high",
        description: "Updated completed status in MongoDB via Mongoose findByIdAndUpdate"
      });
      break;

    case 'deleteSample':
      url = `/tasks/${firstTaskId}`;
      method = 'DELETE';
      break;

    case 'testMissingHeader':
      url = '/tasks';
      method = 'POST';
      body = '{"title":"missing content-type header"}';
      break;

    case 'testInvalidId':
      url = '/tasks/invalid-id-format';
      method = 'GET';
      break;

    case 'testTaskNotFound':
      url = '/tasks/507f1f77bcf86cd799439099'; // Valid ObjectId format, but non-existent
      method = 'GET';
      break;

    case 'testUndefinedRoute':
      url = '/api/unsupported-endpoint';
      method = 'GET';
      break;

    case 'testSimulateError':
      url = '/tasks/simulate/error';
      method = 'GET';
      break;
  }

  testUrlLabel.textContent = `${method} ${url}`;
  testStatusPill.className = 'pill pill-idle';
  testStatusPill.textContent = 'Sending...';
  testJsonOutput.textContent = '// Sending HTTP request to Express server with MongoDB...';

  const startTime = performance.now();

  try {
    const fetchOptions = { method, headers };
    if (body) fetchOptions.body = body;

    const response = await fetch(url, fetchOptions);
    const duration = Math.round(performance.now() - startTime);

    testTimePill.textContent = `${duration} ms`;
    testStatusPill.className = `pill pill-${response.status}`;
    testStatusPill.textContent = `${response.status} ${response.statusText || ''}`;

    let json;
    try {
      json = await response.json();
      testJsonOutput.textContent = JSON.stringify(json, null, 2);
    } catch {
      const text = await response.text();
      testJsonOutput.textContent = text;
    }

    if (['POST', 'PUT', 'DELETE'].includes(method) && response.ok) {
      fetchTasks();
    }
  } catch (err) {
    testTimePill.textContent = `${Math.round(performance.now() - startTime)} ms`;
    testStatusPill.className = 'pill pill-500';
    testStatusPill.textContent = 'Fetch Error';
    testJsonOutput.textContent = JSON.stringify({
      error: "Connection failed",
      message: err.message
    }, null, 2);
  }
}
