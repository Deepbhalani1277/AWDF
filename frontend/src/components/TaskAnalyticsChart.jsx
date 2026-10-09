import { useMemo } from 'react';
import './TaskAnalyticsChart.css';

/**
 * Heavy Supplementary Component - Practical 8
 * Dynamically code-split and loaded only when requested by user in the Task Manager view.
 */
function TaskAnalyticsChart({ tasks = [] }) {
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
        <span className="analytics-badge">Lazy Loaded Chunk</span>
      </div>

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
