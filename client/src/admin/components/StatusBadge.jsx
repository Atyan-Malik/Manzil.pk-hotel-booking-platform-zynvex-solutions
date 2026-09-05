const STYLES = {
  active: "bg-primary/15 text-ink border-primary/30",
  draft: "bg-ink/5 text-ink-soft border-line",
  inactive: "bg-ink/5 text-ink-faint border-line",
  pending: "bg-warning/15 text-warning border-warning/30",
  confirmed: "bg-primary/15 text-ink border-primary/30",
  checked_in: "bg-blue-50 text-blue-700 border-blue-200",
  checked_out: "bg-ink/5 text-ink-soft border-line",
  cancelled: "bg-danger/10 text-danger border-danger/20",
  no_show: "bg-danger/10 text-danger border-danger/20",
  paid: "bg-primary/15 text-ink border-primary/30",
  unpaid: "bg-danger/10 text-danger border-danger/20",
  partial: "bg-warning/15 text-warning border-warning/30",
  refunded: "bg-ink/5 text-ink-soft border-line",
};

const LABELS = {
  checked_in: "Checked in",
  checked_out: "Checked out",
  no_show: "No show",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
      STYLES[status] || "bg-ink/5 text-ink-soft border-line"
    }`}
  >
    {LABELS[status] || status?.replace(/_/g, " ")}
  </span>
);

export default StatusBadge;
