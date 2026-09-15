const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div
    className="
      flex flex-col items-center justify-center gap-3
      rounded-[1.5rem] border border-[#E2E8DE] bg-[#F8FAF5]
      px-6 py-14 text-center
    "
  >
    {Icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
        <Icon size={22} className="text-muted" />
      </div>
    )}
    <p className="font-display text-base font-bold text-ink">{title}</p>
    {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
