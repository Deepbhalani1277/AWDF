import { useMemo, useState, useEffect } from 'react';
import { fetchCacheStatsAPI, flushCacheAPI } from '../services/api';
import './TaskAnalyticsChart.css';

/**
 * Heavy Supplementary Component - Practical 8 & 9
 * Code-split chunk displaying task statistics and Practical 9 server-side in-memory cache telemetry.
 */
function TaskAnalyticsChart({ tasks = [] }) {
  const [cacheStats, setCacheStats] = useState(null);
  const [loadingCache, setLoadingCache] = useState(false);

  const loadCacheTelemetry = async () => {
    try {
      setLoadingCache(true);
      const data = await fetchCacheStatsAPI();
      setCacheStats(data);
    } catch (err) {
      console.error('Failed to load cache metrics:', err);
    } finally {
      setLoadingCache(false);
    }
  };

  useEffect(() => {
    loadCacheTelemetry();
  }, [tasks]);

  const handleFlushCache = async () => {
    try {
      await flushCacheAPI();
      await loadCacheTelemetry();
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
          <h3>Performance & Task Distribution Analytics</h3>
        </div>
        <div className="analytics-badges">
          <span className="analytics-badge">Lazy Chunk (Prac 8)</span>
          <span className="cache-badge">node-cache (Prac 9)</span>
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
                onClick={loadCacheTelemetry}
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
