/**
 * Central API Service - Practical 7: Authentication & Middleware Pipeline
 * Includes token storage, auth headers, user registration/login, and protected task calls.
 */

const BASE_URL = 'http://localhost:5000/api';

// Token Management
export const getToken = () => localStorage.getItem('awdf_token');
export const setToken = (token) => localStorage.setItem('awdf_token', token);
export const removeToken = () => {
  localStorage.removeItem('awdf_token');
  localStorage.removeItem('awdf_user');
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('awdf_user') || 'null');
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('awdf_user', JSON.stringify(user));
};

// Helper for Authorization Header
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// ==========================================
// Authentication API Calls
// ==========================================

export const registerAPI = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  setToken(data.token);
  setStoredUser(data.user);
  return data;
};

export const loginAPI = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  setToken(data.token);
  setStoredUser(data.user);
  return data;
};

export const getMeAPI = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch user');
  }
  return data.user;
};

// ==========================================
// Protected Tasks API Calls
// ==========================================

export const fetchTasksAPI = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.completed !== undefined && params.completed !== '') query.append('completed', params.completed);
  if (params.priority) query.append('priority', params.priority);
  if (params.search) query.append('search', params.search);

  const url = query.toString() ? `${BASE_URL}/tasks?${query.toString()}` : `${BASE_URL}/tasks`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      throw new Error('401_UNAUTHORIZED');
    }
    throw new Error(data.error || 'Failed to fetch tasks');
  }
  return data.data;
};

export const createTaskAPI = async (taskData) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      throw new Error('401_UNAUTHORIZED');
    }
    throw new Error(data.messages ? data.messages.join(', ') : (data.error || 'Failed to create task'));
  }
  return data.data;
};

export const updateTaskAPI = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      throw new Error('401_UNAUTHORIZED');
    }
    throw new Error(data.messages ? data.messages.join(', ') : (data.error || 'Failed to update task'));
  }
  return data.data;
};

export const deleteTaskAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      throw new Error('401_UNAUTHORIZED');
    }
    throw new Error(data.error || 'Failed to delete task');
  }
  return data.data;
};
