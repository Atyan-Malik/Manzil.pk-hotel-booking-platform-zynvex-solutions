import { Menu } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const Topbar = ({ title, subtitle, onMenuClick, actions }) => {
  const { admin } = useAdminAuth();
  const initials = admin?.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface/95 px-5 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-muted md:hidden">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-ink md:text-xl">{title}</h1>
          {subtitle && <p className="text-sm text-ink-faint">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-primary">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
