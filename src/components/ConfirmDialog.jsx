import { useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import useModal from '../hooks/useModal.js';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete task',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  useModal(dialogRef, onCancel);

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        className="dialog dialog--small"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="dialog__icon" aria-hidden="true">
          <AlertTriangle size={22} />
        </div>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="dialog__actions">
          {/* Cancel gets focus first: the safe choice for a destructive action. */}
          <button type="button" className="btn btn--ghost" onClick={onCancel} data-autofocus>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
