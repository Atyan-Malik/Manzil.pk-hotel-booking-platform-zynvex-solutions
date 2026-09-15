const StatCard = ({ icon: Icon, label, value, hint }) => (
  <div
    className="
      relative overflow-hidden rounded-[1.5rem] border border-[#E2E8DE]
      bg-white p-5 shadow-[0_4px_20px_rgba(23,33,15,0.025)]
    "
  >
    <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#8FE13D]/10 blur-2xl" />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-ink">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F6EC] text-[#6B8B55]">
          <Icon size={18} />
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
