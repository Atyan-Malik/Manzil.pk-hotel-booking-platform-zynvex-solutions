const StatCard = ({ label, value, icon: Icon, trend, accent = false }) => (
  <div className={`card flex items-center justify-between ${accent ? "bg-ink text-white" : ""}`}>
    <div>
      <p className={`text-sm font-medium ${accent ? "text-white/60" : "text-ink-faint"}`}>{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold">{value}</p>
      {trend && <p className={`mt-1 text-xs ${accent ? "text-primary" : "text-ink-soft"}`}>{trend}</p>}
    </div>
    {Icon && (
      <div className={`rounded-xl p-2.5 ${accent ? "bg-white/10" : "bg-primary/15"}`}>
        <Icon size={20} className={accent ? "text-primary" : "text-ink"} strokeWidth={2} />
      </div>
    )}
  </div>
);

export default StatCard;
