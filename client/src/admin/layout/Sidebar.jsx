
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Building2,
  CalendarCheck,
  LogOut,
  X,
  Contact,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { useAdminAuth } from "../context/AdminAuthContext";

const NAV = [
  {
    to: "/admin",
    label: "Overview",
    icon: LayoutGrid,
    end: true,
  },

  {
    label: "Hotels",
    type: "section",
    children: [
      {
        to: "/admin/hotels",
        label: "All hotels",
        icon: Building2,
        end: true,
      },
      {
        to: "/admin/hotels/contact",
        label: "Contact",
        icon: Contact,
      },
      {
        to: "/admin/hotels/policies",
        label: "Policies",
        icon: ShieldCheck,
      },
    ],
  },

  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: CalendarCheck,
  },
];

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAdminAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          flex w-64 flex-col
          border-r border-white/5
          bg-surface-panel
          px-3 py-5
          transition-transform duration-300
          md:sticky md:top-0 md:h-screen
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-sm font-extrabold text-ink shadow-sm">
              M.
            </div>

            <div>
              <p className="font-display text-sm font-bold leading-none text-white">
                Manzil.pk
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white/55">
                Admin panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {NAV.map((item) => {
              /* ---------------------------------------------
                 SECTION WITH CHILDREN
              --------------------------------------------- */
              if (item.type === "section") {
                return (
                  <div key={item.label} className="pt-2">
                    {/* Section label */}
                    <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                      {item.label}
                    </div>

                    {/* Hotel navigation group */}
                    <div className="ml-2 border-l border-white/8 pl-2">
                      {item.children.map(
                        ({ to, label, icon: Icon, end }) => (
                          <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={onClose}
                            className={({ isActive }) => `
                              group relative flex items-center gap-3
                              rounded-lg px-3 py-2
                              text-[13px] font-medium
                              transition-all duration-200
                              ${
                                isActive
                                  ? "bg-primary/10 font-semibold text-primary"
                                  : "text-white/45 hover:bg-white/5 hover:text-white/85"
                              }
                            `}
                          >
                            {({ isActive }) => (
                              <>
                                {/* Active indicator */}
                                {isActive && (
                                  <span className="absolute -left-[9px] h-4 w-0.5 rounded-full bg-primary" />
                                )}

                                <Icon
                                  size={16}
                                  strokeWidth={isActive ? 2.2 : 1.9}
                                  className="shrink-0"
                                />

                                <span>{label}</span>

                                {isActive && (
                                  <ChevronRight
                                    size={13}
                                    className="ml-auto opacity-70"
                                  />
                                )}
                              </>
                            )}
                          </NavLink>
                        )
                      )}
                    </div>
                  </div>
                );
              }

              /* ---------------------------------------------
                 NORMAL NAV ITEM
              --------------------------------------------- */
              const {
                to,
                label,
                icon: Icon,
                end,
              } = item;

              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3
                    rounded-xl px-3.5 py-2.5
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary font-semibold text-ink"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 h-5 w-1 rounded-r-full bg-ink" />
                      )}

                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.3 : 2}
                      />

                      <span>{label}</span>

                      {isActive && (
                        <ChevronRight
                          size={14}
                          className="ml-auto"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="mt-4 border-t border-white/8 pt-4">
          <button
            type="button"
            onClick={logout}
            className="
              flex w-full items-center gap-3
              rounded-xl px-3.5 py-2.5
              text-sm font-medium
              text-white/55
              transition-all duration-200
              hover:bg-white/5
              hover:text-white
            "
          >
            <LogOut size={18} strokeWidth={2} />

            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
