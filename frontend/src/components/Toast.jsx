import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container toast-${type}`}>
      <div className="toast-icon">
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
}

export default Toast;
