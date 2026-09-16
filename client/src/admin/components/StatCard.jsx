
const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  accent = false,
}) => {
  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl border
        p-5
        transition-all duration-200
        ${
          accent
            ? "border-ink bg-ink text-white shadow-sm"
            : "border-line bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:shadow-md"
        }
      `}
    >
      {/* Subtle accent glow */}
      {accent && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
      )}

      <div className="relative flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p
            className={`
              text-xs font-semibold uppercase
              tracking-[0.08em]
              ${
                accent
                  ? "text-white/50"
                  : "text-ink-faint"
              }
            `}
          >
            {label}
          </p>

          <p
            className={`
              mt-2
              truncate
              font-display
              text-2xl
              font-extrabold
              tracking-tight
              sm:text-[27px]
              ${
                accent
                  ? "text-white"
                  : "text-ink"
              }
            `}
          >
            {value}
          </p>

          {trend && (
            <p
              className={`
                mt-1.5
                truncate
                text-[11px]
                font-medium
                leading-5
                ${
                  accent
                    ? "text-primary"
                    : "text-ink-soft"
                }
              `}
            >
              {trend}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className={`
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              transition-transform duration-200
              group-hover:scale-105
              ${
                accent
                  ? "bg-white/10"
                  : "bg-primary-light"
              }
            `}
          >
            <Icon
              size={19}
              strokeWidth={2}
              className={
                accent
                  ? "text-primary"
                  : "text-ink"
              }
            />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      {!accent && (
        <div className="absolute bottom-0 left-5 right-5 h-px bg-primary/0 transition-colors duration-200 group-hover:bg-primary/40" />
      )}
    </div>
  );
};

export default StatCard;
