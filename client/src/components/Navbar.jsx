import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Bell, User, CalendarDays } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import { getMyNotifications } from "../services/notificationService";

const dashboardPathByRole = {
  [ROLES.CUSTOMER]: "/my-bookings",
  [ROLES.HOTEL_MANAGER]: "/manager/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-ink" : "text-muted hover:text-ink"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  // Fetch unread notification count
 useEffect(() => {
  if (!user) {
    setUnreadCount(0);
    return;
  }

  const fetchUnreadCount = async () => {
    try {
      const data = await getMyNotifications();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
      setUnreadCount(0);
    }
  };

  // Initial fetch
  fetchUnreadCount();

  // Refresh when user returns to the tab/window
  const handleFocus = () => {
    fetchUnreadCount();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };
}, [user, location.pathname]);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="container-page">
        <nav className="flex items-center justify-between rounded-full border border-slateline bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 pl-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
              M.
            </span>

            <span className="font-display text-lg font-bold tracking-tight">
              Manzil.Pk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>

            <NavLink to="/hotels" className={navLinkClass}>
              Hotels
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact Us
            </NavLink>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                {/* My Bookings - Customers Only */}
                {user.role === ROLES.CUSTOMER && (
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-surface text-ink"
                          : "text-muted hover:bg-surface hover:text-ink"
                      }`
                    }
                  >
                    <CalendarDays size={17} />
                    My Bookings
                  </NavLink>
                )}

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <Bell size={20} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User / Dashboard */}
                <Link
                  to={dashboardPathByRole[user.role]}
                  className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink"
                >
                  <User size={16} />
                  {user.name.split(" ")[0]}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted hover:text-ink"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted hover:text-ink"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="btn-accent px-5 py-2 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-2 flex flex-col gap-1 rounded-3xl border border-slateline bg-white p-4 shadow-soft md:hidden">
            <NavLink
              to="/"
              className={navLinkClass}
              end
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/hotels"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Hotels
            </NavLink>

            <NavLink
              to="/about"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </NavLink>

            <div className="mt-2 flex flex-col gap-2 border-t border-slateline pt-3">
              {user ? (
                <>
                  {/* My Bookings - Customers Only */}
                  {user.role === ROLES.CUSTOMER && (
                    <NavLink
                      to="/my-bookings"
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                          isActive
                            ? "bg-surface text-ink"
                            : "text-muted hover:bg-surface hover:text-ink"
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CalendarDays size={17} />
                      My Bookings
                    </NavLink>
                  )}

                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell size={17} />

                    <span>Notifications</span>

                    {unreadCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Dashboard */}
                  <Link
                    to={dashboardPathByRole[user.role]}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={17} />
                    Dashboard
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left text-sm text-muted hover:text-ink"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="btn-accent text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;