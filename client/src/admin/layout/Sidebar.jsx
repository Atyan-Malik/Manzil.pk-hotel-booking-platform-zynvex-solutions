import { NavLink } from "react-router-dom";
import { LayoutGrid, Building2, CalendarCheck, LogOut, X } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/hotels", label: "Hotels", icon: Building2 },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAdminAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink/40 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col bg-surface-panel px-4 py-6 transition-transform md:sticky md:top-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-ink">
              M.
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white leading-none">Manzil.pk</p>
              <p className="text-[11px] text-white/40 leading-none mt-1">Admin panel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-ink font-semibold"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} strokeWidth={2} />
          Log out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
