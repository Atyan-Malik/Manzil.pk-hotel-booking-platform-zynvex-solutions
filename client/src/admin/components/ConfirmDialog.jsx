import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({ open, title, description, confirmLabel = "Confirm", danger = false, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between">
          <div className={`rounded-full p-2 ${danger ? "bg-danger/10" : "bg-primary/15"}`}>
            <AlertTriangle size={18} className={danger ? "text-danger" : "text-ink"} />
          </div>
          <button onClick={onCancel} className="text-ink-faint hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <h3 className="mt-3 font-display text-base font-bold">{title}</h3>
        <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className={danger ? "btn-danger" : "btn-primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
