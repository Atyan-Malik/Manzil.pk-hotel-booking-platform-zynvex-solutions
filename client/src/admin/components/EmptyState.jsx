const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line bg-white py-16 text-center">
    {Icon && (
      <div className="mb-3 rounded-full bg-primary/15 p-3">
        <Icon size={22} className="text-ink" />
      </div>
    )}
    <p className="font-display text-base font-bold text-ink">{title}</p>
    {description && <p className="mt-1 max-w-xs text-sm text-ink-faint">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
