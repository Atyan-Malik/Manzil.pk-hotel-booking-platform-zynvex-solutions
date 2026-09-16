
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  CalendarDays,
  ChevronRight,
  LogOut,
  Hotel,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import { getMyNotifications } from "../services/notificationService";

const dashboardPathByRole = {
  [ROLES.CUSTOMER]: "/my-bookings",
  [ROLES.HOTEL_MANAGER]: "/owner",
  [ROLES.ADMIN]: "/admin/dashboard",
};

/* -------------------------------------------------------
   Main navigation link
------------------------------------------------------- */

const navLinkClass = ({ isActive }) =>
  `relative flex items-center py-2 text-sm font-semibold transition-colors duration-200 ${
    isActive
      ? "text-ink"
      : "text-muted hover:text-ink"
  } ${
    isActive
      ? "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-primary"
      : ""
  }`;

/* -------------------------------------------------------
   Navbar
------------------------------------------------------- */

const Navbar = () => {
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  /* -----------------------------------------------------
     Fetch unread notification count
  ----------------------------------------------------- */

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const data = await getMyNotifications();
        setUnreadCount(data?.unreadCount || 0);
      } catch (error) {
        console.error(
          "Failed to fetch notification count:",
          error
        );
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    const handleFocus = () => {
      fetchUnreadCount();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, location.pathname]);

  /* -----------------------------------------------------
     Close mobile menu when route changes
  ----------------------------------------------------- */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /* -----------------------------------------------------
     Logout
  ----------------------------------------------------- */

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-4 z-50 px-3 sm:px-4">
      <div className="container-page">
        <nav
          className="
            flex items-center justify-between
            rounded-full
            border border-slateline
            bg-white/90
            px-3 py-2
            shadow-soft
            backdrop-blur-xl
            supports-[backdrop-filter]:bg-white/80
          "
        >
          {/* =================================================
              Logo
          ================================================= */}

          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2 pl-1 sm:pl-2"
            aria-label="SafarStay home"
          >
            <span
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full
                bg-primary
                text-sm font-extrabold text-ink
                shadow-sm
                transition-transform duration-200
                group-hover:scale-105
              "
            >
              M.
            </span>

            <span
              className="
                hidden font-display text-lg font-extrabold
                tracking-[-0.03em] text-ink
                min-[400px]:block
              "
            >
              Manzil<span className="text-accent-dark">.Pk</span>
            </span>
          </Link>

          {/* =================================================
              Desktop Navigation
          ================================================= */}

          <div className="hidden items-center gap-7 md:flex lg:gap-8">
            <NavLink
              to="/"
              className={navLinkClass}
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/hotels"
              className={navLinkClass}
            >
              Hotels
            </NavLink>

            <NavLink
              to="/about"
              className={navLinkClass}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className={navLinkClass}
            >
              Contact Us
            </NavLink>
          </div>

          {/* =================================================
              Desktop Actions
          ================================================= */}

          <div className="hidden items-center gap-1.5 md:flex">
            {user ? (
              <>
                {/* My Bookings */}
                {user.role === ROLES.CUSTOMER && (
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      `
                        flex items-center gap-2
                        rounded-full
                        px-3 py-2
                        text-sm font-semibold
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-surface text-ink"
                            : "text-muted hover:bg-surface hover:text-ink"
                        }
                      `
                    }
                  >
                    <CalendarDays size={16} strokeWidth={2} />
                    <span className="hidden lg:inline">
                      My Bookings
                    </span>
                  </NavLink>
                )}

                {/* Notification */}
                <Link
                  to="/notifications"
                  aria-label={
                    unreadCount > 0
                      ? `${unreadCount} unread notifications`
                      : "Notifications"
                  }
                  className="
                    relative flex h-9 w-9 items-center justify-center
                    rounded-full
                    text-muted
                    transition-all duration-200
                    hover:bg-surface hover:text-ink
                  "
                >
                  <Bell size={19} strokeWidth={2} />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute right-0 top-0
                        flex h-[18px] min-w-[18px]
                        items-center justify-center
                        rounded-full
                        border-2 border-white
                        bg-red-500
                        px-1
                        text-[9px] font-extrabold
                        leading-none text-white
                      "
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User / Dashboard */}
                <Link
                  to={dashboardPathByRole[user.role]}
                  className="
                    ml-1
                    flex items-center gap-2
                    rounded-full
                    bg-surface
                    px-3.5 py-2
                    text-sm font-bold text-ink
                    transition-all duration-200
                    hover:bg-primary-light
                  "
                >
                  <span
                    className="
                      flex h-6 w-6 items-center justify-center
                      rounded-full
                      bg-primary
                      text-ink
                    "
                  >
                    <User size={14} strokeWidth={2.3} />
                  </span>

                  <span className="max-w-[100px] truncate">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    ml-1
                    flex items-center gap-1.5
                    rounded-full
                    px-3 py-2
                    text-sm font-semibold
                    text-muted
                    transition-colors
                    hover:bg-surface
                    hover:text-ink
                  "
                >
                  <LogOut size={15} />
                  <span className="hidden xl:inline">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="
                    rounded-full
                    px-4 py-2
                    text-sm font-semibold
                    text-muted
                    transition-colors
                    hover:bg-surface
                    hover:text-ink
                  "
                >
                  Log in
                </Link>

                {/* CTA */}
                <Link
                  to="/register"
                  className="
                    ml-1
                    rounded-full
                    bg-primary
                    px-5 py-2.5
                    text-sm font-bold text-ink
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-primary-dark
                    hover:shadow-md
                  "
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* =================================================
              Mobile Menu Button
          ================================================= */}

          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-ink
              transition-colors
              hover:bg-surface
              md:hidden
            "
          >
            {isMenuOpen ? (
              <X size={21} strokeWidth={2} />
            ) : (
              <Menu size={21} strokeWidth={2} />
            )}
          </button>
        </nav>

        {/* =================================================
            Mobile Navigation
        ================================================= */}

        {isMenuOpen && (
          <div
            className="
              mt-2
              overflow-hidden
              rounded-[24px]
              border border-slateline
              bg-white/95
              p-3
              shadow-soft
              backdrop-blur-xl
              md:hidden
            "
          >
            {/* Main links */}
            <div className="space-y-1">
              <MobileNavLink
                to="/"
                label="Home"
                end
                onClick={() => setIsMenuOpen(false)}
              />

              <MobileNavLink
                to="/hotels"
                label="Hotels"
                onClick={() => setIsMenuOpen(false)}
              />

              <MobileNavLink
                to="/about"
                label="About Us"
                onClick={() => setIsMenuOpen(false)}
              />

              <MobileNavLink
                to="/contact"
                label="Contact Us"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            {/* User section */}
            <div className="mt-3 border-t border-slateline pt-3">
              {user ? (
                <div className="space-y-1">
                  {/* My bookings */}
                  {user.role === ROLES.CUSTOMER && (
                    <MobileActionLink
                      to="/my-bookings"
                      icon={CalendarDays}
                      label="My Bookings"
                      onClick={() => setIsMenuOpen(false)}
                    />
                  )}

                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3 py-3
                      text-sm font-semibold text-ink-soft
                      transition-colors
                      hover:bg-surface
                      hover:text-ink
                    "
                  >
                    <span
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg bg-surface-muted
                      "
                    >
                      <Bell size={16} />
                    </span>

                    <span>Notifications</span>

                    {unreadCount > 0 && (
                      <span
                        className="
                          ml-auto
                          flex h-5 min-w-5
                          items-center justify-center
                          rounded-full
                          bg-red-500
                          px-1
                          text-[9px] font-bold text-white
                        "
                      >
                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Dashboard */}
                  <MobileActionLink
                    to={dashboardPathByRole[user.role]}
                    icon={user.role === ROLES.HOTEL_MANAGER ? Hotel : User}
                    label={
                      user.role === ROLES.HOTEL_MANAGER
                        ? "Owner Dashboard"
                        : user.role === ROLES.ADMIN
                        ? "Admin Dashboard"
                        : "My Account"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full items-center gap-3
                      rounded-xl
                      px-3 py-3
                      text-left
                      text-sm font-semibold text-muted
                      transition-colors
                      hover:bg-red-50 hover:text-red-600
                    "
                  >
                    <span
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg bg-surface-muted
                      "
                    >
                      <LogOut size={16} />
                    </span>

                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Login */}
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      flex items-center justify-between
                      rounded-xl
                      px-3 py-3
                      text-sm font-semibold text-ink
                      transition-colors
                      hover:bg-surface
                    "
                  >
                    Log in
                    <ChevronRight size={16} className="text-muted" />
                  </Link>

                  {/* Register */}
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      flex items-center justify-center gap-2
                      rounded-xl
                      bg-primary
                      px-4 py-3
                      text-sm font-bold text-ink
                      transition-all
                      hover:bg-primary-dark
                    "
                  >
                    Get Started
                    <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

/* =========================================================
   Mobile Navigation Link
========================================================= */

const MobileNavLink = ({
  to,
  label,
  end = false,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `
          flex items-center justify-between
          rounded-xl
          px-3 py-3
          text-sm font-semibold
          transition-colors
          ${
            isActive
              ? "bg-primary-light text-ink"
              : "text-ink-soft hover:bg-surface hover:text-ink"
          }
        `
      }
    >
      {label}

      <ChevronRight
        size={15}
        className="text-ink-faint"
      />
    </NavLink>
  );
};

/* =========================================================
   Mobile Action Link
========================================================= */

const MobileActionLink = ({
  to,
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        flex items-center gap-3
        rounded-xl
        px-3 py-3
        text-sm font-semibold text-ink-soft
        transition-colors
        hover:bg-surface
        hover:text-ink
      "
    >
      <span
        className="
          flex h-8 w-8 items-center justify-center
          rounded-lg bg-surface-muted
        "
      >
        <Icon size={16} />
      </span>

      {label}
    </Link>
  );
};

export default Navbar;
