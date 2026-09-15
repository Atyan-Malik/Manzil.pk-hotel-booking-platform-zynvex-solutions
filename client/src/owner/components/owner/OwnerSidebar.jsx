import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Star,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const navItems = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/owner/hotels", label: "My Hotels", icon: Building2 },
  { to: "/owner/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/owner/reviews", label: "Reviews", icon: Star },
  { to: "/owner/profile", label: "Profile", icon: UserCircle },
];

const OwnerSidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-[#E9EFE4] px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8FE13D] font-display text-sm font-black text-[#17210F]">
            M
          </span>
          <div>
            <p className="font-display text-sm font-extrabold leading-tight text-ink">
              Manzil.pk
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Owner Panel
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-[#F1F6EC] lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Owner info */}
      <div className="border-b border-[#E9EFE4] px-5 py-4">
        <p className="truncate text-sm font-bold text-ink">{user?.name || "Hotel Owner"}</p>
        <p className="truncate text-xs text-muted">{user?.email}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#8FE13D] text-[#17210F]"
                  : "text-ink/70 hover:bg-[#F1F6EC] hover:text-ink"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#E9EFE4] p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;
