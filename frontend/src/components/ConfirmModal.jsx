import "./ConfirmModal.css";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-box">
        <h3>{title || "Confirm Action"}</h3>
        <p>{message || "Are you sure you want to proceed?"}</p>
        <div className="confirm-modal-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn-delete" onClick={onConfirm}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
