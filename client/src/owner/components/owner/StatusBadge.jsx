const STYLES = {
  approved: "bg-accent/20 text-accent-dark",
  confirmed: "bg-accent/20 text-accent-dark",
  completed: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  suspended: "bg-slate-200 text-slate-600",
};

const StatusBadge = ({ status }) => (
  <span
    className={`
      inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize
      ${STYLES[status] || "bg-slate-100 text-slate-700"}
    `}
  >
    {status}
  </span>
);

export default StatusBadge;
