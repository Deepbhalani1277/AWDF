import { useMemo, useState, useEffect } from 'react';
import { fetchCacheStatsAPI, flushCacheAPI, fetchEventHistoryAPI } from '../services/api';
import './TaskAnalyticsChart.css';

/**
 * Heavy Supplementary Component - Practical 8, 9 & 10
 * Code-split chunk displaying task statistics, Practical 9 cache telemetry,
 * and Practical 10 asynchronous event-driven background processing logs.
 */
function TaskAnalyticsChart({ tasks = [] }) {
  const [cacheStats, setCacheStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingCache, setLoadingCache] = useState(false);

  const loadTelemetry = async () => {
    try {
      setLoadingCache(true);
      const [cacheData, eventData] = await Promise.all([
        fetchCacheStatsAPI(),
        fetchEventHistoryAPI()
      ]);
      setCacheStats(cacheData);
      setEvents(eventData || []);
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setLoadingCache(false);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, [tasks]);

  const handleFlushCache = async () => {
    try {
      await flushCacheAPI();
      await loadTelemetry();
    } catch (err) {
      console.error('Failed to flush cache:', err);
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const high = tasks.filter((t) => t.priority === 'high').length;
    const medium = tasks.filter((t) => t.priority === 'medium').length;
    const low = tasks.filter((t) => t.priority === 'low').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, high, medium, low, completionRate };
  }, [tasks]);

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <div className="analytics-title">
          <span className="analytics-icon">📊</span>
          <h3>Performance, Caching & Event Bus Telemetry</h3>
        </div>
        <div className="analytics-badges">
          <span className="analytics-badge">Lazy Chunk (Prac 8)</span>
          <span className="cache-badge">node-cache (Prac 9)</span>
          <span className="event-badge">EventEmitter (Prac 10)</span>
        </div>
      </div>

      {/* Practical 9: In-Memory Cache Telemetry */}
      {cacheStats && (
        <div className="cache-telemetry-section">
          <div className="cache-telemetry-header">
            <h4>⚡ Server-Side In-Memory Cache Telemetry (node-cache)</h4>
            <div className="cache-actions">
              <button
                type="button"
                className="cache-action-btn refresh-btn"
                onClick={loadTelemetry}
                disabled={loadingCache}
              >
                🔄 Refresh
              </button>
              <button
                type="button"
                className="cache-action-btn flush-btn"
                onClick={handleFlushCache}
              >
                🗑 Flush Cache
              </button>
            </div>
          </div>
          <div className="cache-telemetry-grid">
            <div className="cache-stat-box">
              <span className="cache-stat-label">Cache Hit Rate</span>
              <span className="cache-stat-val highlight">{cacheStats.hitRate}</span>
            </div>
            <div className="cache-stat-box">
              <span className="cache-stat-label">Cache Hits</span>
              <span className="cache-stat-val text-green">{cacheStats.hits}</span>
            </div>
            <div className="cache-stat-box">
              <span className="cache-stat-label">Cache Misses</span>
              <span className="cache-stat-val text-amber">{cacheStats.misses}</span>
            </div>
            <div className="cache-stat-box">
              <span className="cache-stat-label">Invalidations</span>
              <span className="cache-stat-val">{cacheStats.invalidations}</span>
            </div>
            <div className="cache-stat-box">
              <span className="cache-stat-label">TTL Expiry</span>
              <span className="cache-stat-val">{cacheStats.defaultTTLSeconds}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Practical 10: Asynchronous Event-Driven Stream */}
      <div className="events-stream-section">
        <div className="events-stream-header">
          <h4>📡 Asynchronous Event-Driven Bus Logs (Node.js EventEmitter)</h4>
          <span className="events-count-pill">{events.length} Events Logged</span>
        </div>
        {events.length === 0 ? (
          <p className="no-events-text">No background events emitted yet. Create or delete a task to trigger non-blocking listeners!</p>
        ) : (
          <div className="events-timeline">
            {events.slice(0, 4).map((evt) => (
              <div key={evt.id} className={`event-log-item event-${evt.type}`}>
                <div className="event-item-top">
                  <span className="event-tag">{evt.type}</span>
                  <span className="event-time">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="event-item-details">
                  {evt.type === 'task-created' && (
                    <span>
                      Task: <strong>"{evt.payload?.title}"</strong> | User: {evt.payload?.user} |
                      Worker: <em className="text-green">Dispatched asynchronously</em>
                    </span>
                  )}
                  {evt.type === 'task-deleted' && (
                    <span>
                      Deleted Task ID: <code>{evt.payload?.taskId?.slice(-6)}</code> | By: {evt.payload?.user}
                    </span>
                  )}
                  {evt.type === 'task-updated' && (
                    <span>
                      Updated Task: <strong>"{evt.payload?.title}"</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Distribution Metrics */}
      <div className="analytics-grid">
        <div className="metric-box total-box">
          <span className="metric-label">Total Tasks</span>
          <span className="metric-value">{stats.total}</span>
        </div>
        <div className="metric-box completed-box">
          <span className="metric-label">Completed</span>
          <span className="metric-value">{stats.completed}</span>
        </div>
        <div className="metric-box pending-box">
          <span className="metric-label">Pending</span>
          <span className="metric-value">{stats.pending}</span>
        </div>
        <div className="metric-box rate-box">
          <span className="metric-label">Completion Rate</span>
          <span className="metric-value">{stats.completionRate}%</span>
        </div>
      </div>

      <div className="analytics-bars">
        <h4>Priority Breakdown</h4>
        <div className="bar-group">
          <div className="bar-label">
            <span>High Priority ({stats.high})</span>
            <span>{stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}%</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill bar-high"
              style={{ width: `${stats.total > 0 ? (stats.high / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bar-group">
          <div className="bar-label">
            <span>Medium Priority ({stats.medium})</span>
            <span>{stats.total > 0 ? Math.round((stats.medium / stats.total) * 100) : 0}%</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill bar-med"
              style={{ width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bar-group">
          <div className="bar-label">
            <span>Low Priority ({stats.low})</span>
            <span>{stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0}%</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill bar-low"
              style={{ width: `${stats.total > 0 ? (stats.low / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAnalyticsChart;
