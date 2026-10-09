import taskEvents from './taskEvents.js';

/**
 * Task Event Listeners - Practical 10
 * Handles background operations (logging, simulated notifications/emails) asynchronously.
 */

// 1. Primary Event Listener: 'task-created'
taskEvents.on('task-created', (data) => {
  const { task, user, apiTimestamp } = data;
  const listenerStartTimestamp = new Date().toISOString();

  console.log(`\n======================================================`);
  console.log(`[EVENT RECEIVED] 'task-created' event triggered!`);
  console.log(`[TIMING] API responded at:      ${apiTimestamp}`);
  console.log(`[TIMING] Listener started at:   ${listenerStartTimestamp}`);
  console.log(`[PAYLOAD] Task Title: "${task.title}" (ID: ${task._id})`);
  console.log(`[PAYLOAD] User: ${user ? `${user.name} <${user.email}>` : 'System User'}`);
  console.log(`======================================================`);

  // Supplementary: Simulate a heavy asynchronous notification worker (e.g., SMTP Email dispatch, SMS, or Webhook)
  setTimeout(() => {
    try {
      const completionTimestamp = new Date().toISOString();
      console.log(`\n[ASYNC NOTIFICATION WORKER COMPLETE]`);
      console.log(`[NOTIFICATION] Background notification dispatched for "${task.title}".`);
      console.log(`[TIMING] Worker completed at:   ${completionTimestamp}`);
      console.log(`[STATUS] Non-blocking execution verified — API response was never delayed!\n`);

      taskEvents.logEvent('task-created', {
        taskId: task._id,
        title: task.title,
        priority: task.priority,
        user: user ? user.email : 'anonymous',
        apiTimestamp,
        listenerStartTimestamp,
        completionTimestamp
      }, 'dispatched');
    } catch (err) {
      taskEvents.emit('error', err);
    }
  }, 1200); // 1.2s artificial non-blocking delay
});

// 2. Supplementary Event Listener: 'task-deleted'
taskEvents.on('task-deleted', (data) => {
  const { taskId, title, user, apiTimestamp } = data;
  const listenerTimestamp = new Date().toISOString();

  console.log(`\n------------------------------------------------------`);
  console.log(`[EVENT RECEIVED] 'task-deleted' event triggered!`);
  console.log(`[TIMING] API responded at:      ${apiTimestamp}`);
  console.log(`[TIMING] Listener executed at:  ${listenerTimestamp}`);
  console.log(`[PAYLOAD] Deleted Task ID: ${taskId} ("${title || 'Untitled'}")`);
  console.log(`[PAYLOAD] Triggered by: ${user ? user.email : 'System'}`);
  console.log(`------------------------------------------------------\n`);

  taskEvents.logEvent('task-deleted', {
    taskId,
    title,
    user: user ? user.email : 'anonymous',
    apiTimestamp,
    listenerTimestamp
  }, 'logged');
});

// 3. Supplementary Event Listener: 'task-updated'
taskEvents.on('task-updated', (data) => {
  const { taskId, title, user, updates, apiTimestamp } = data;
  const listenerTimestamp = new Date().toISOString();

  console.log(`\n[EVENT RECEIVED] 'task-updated' for Task: "${title}" at ${listenerTimestamp}`);

  taskEvents.logEvent('task-updated', {
    taskId,
    title,
    updates,
    user: user ? user.email : 'anonymous',
    apiTimestamp,
    listenerTimestamp
  }, 'logged');
});

// 4. Supplementary Event Listener: 'error'
taskEvents.on('error', (err) => {
  console.error(`\n[EVENT BUS ERROR] Caught error inside background listener:`, err.message);
  taskEvents.logEvent('error', {
    errorMessage: err.message,
    timestamp: new Date().toISOString()
  }, 'failed');
});

console.log('✔ Task Event Listeners initialized and registered successfully.');
