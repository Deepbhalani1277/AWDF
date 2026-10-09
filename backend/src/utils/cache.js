import NodeCache from 'node-cache';

/**
 * In-Memory Caching Module - Practical 9
 * Standard TTL: 60 seconds
 * Tracks cache performance statistics (hits, misses, invalidations)
 */

const nodeCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
  useClones: false
});

// Cache performance telemetry counters
const metrics = {
  hits: 0,
  misses: 0,
  invalidations: 0,
  lastInvalidationTime: null
};

export const taskCache = {
  /**
   * Retrieve item from cache
   */
  get: (key) => {
    const val = nodeCache.get(key);
    if (val !== undefined) {
      metrics.hits += 1;
      return val;
    }
    metrics.misses += 1;
    return null;
  },

  /**
   * Store item in cache with optional TTL
   */
  set: (key, val, ttl = 60) => {
    return nodeCache.set(key, val, ttl);
  },

  /**
   * Delete specific key from cache
   */
  del: (key) => {
    return nodeCache.del(key);
  },

  /**
   * Invalidate all task list query variations and individual task caches
   */
  invalidateTasks: () => {
    const keys = nodeCache.keys();
    const taskKeys = keys.filter(k => k.startsWith('tasks_') || k === 'all_tasks' || k.startsWith('task_'));
    if (taskKeys.length > 0) {
      nodeCache.del(taskKeys);
    }
    metrics.invalidations += 1;
    metrics.lastInvalidationTime = new Date().toISOString();
    return taskKeys.length;
  },

  /**
   * Invalidate single task cache
   */
  invalidateTaskById: (id) => {
    nodeCache.del(`task_${id}`);
    taskCache.invalidateTasks();
  },

  /**
   * Flush all in-memory keys
   */
  flush: () => {
    nodeCache.flushAll();
    metrics.invalidations += 1;
    metrics.lastInvalidationTime = new Date().toISOString();
  },

  /**
   * Get telemetry stats (Supplementary: Debug endpoint)
   */
  getStats: () => {
    const totalRequests = metrics.hits + metrics.misses;
    const hitRate = totalRequests > 0 ? `${((metrics.hits / totalRequests) * 100).toFixed(1)}%` : '0%';
    const keys = nodeCache.keys();

    return {
      success: true,
      data: {
        keysCount: keys.length,
        activeKeys: keys,
        hits: metrics.hits,
        misses: metrics.misses,
        hitRate,
        invalidations: metrics.invalidations,
        lastInvalidationTime: metrics.lastInvalidationTime,
        defaultTTLSeconds: 60
      }
    };
  }
};

export default taskCache;
