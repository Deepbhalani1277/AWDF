import { EventEmitter } from 'events';

/**
 * TaskEvents - Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Native Node.js EventEmitter instance for decoupling background notifications from HTTP request path.
 */
class TaskEventEmitter extends EventEmitter {
  constructor() {
    super();
    // In-memory buffer of recent background event logs for debug inspection & UI verification
    this.eventHistory = [];
  }

  logEvent(type, payload, status = 'processed') {
    const entry = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      type,
      timestamp: new Date().toISOString(),
      payload,
      status
    };
    this.eventHistory.unshift(entry);
    if (this.eventHistory.length > 50) {
      this.eventHistory.pop();
    }
    return entry;
  }

  getHistory() {
    return this.eventHistory;
  }
}

// Shared singleton event bus
const taskEvents = new TaskEventEmitter();

export default taskEvents;
