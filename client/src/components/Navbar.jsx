import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Bell, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const dashboardPathByRole = {
  [ROLES.CUSTOMER]: "/my-bookings",
  [ROLES.HOTEL_MANAGER]: "/manager/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-ink" : "text-muted hover:text-ink"}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="container-page">
        <nav className="flex items-center justify-between rounded-full border border-slateline bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur">
          <Link to="/" className="flex items-center gap-2 pl-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
              M.
            </span>
            <span className="font-display text-lg font-bold tracking-tight">Manzil.Pk</span>
          </Link>

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

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <Bell size={18} />
                </Link>
                <Link
                  to={dashboardPathByRole[user.role]}
                  className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink"
                >
                  <User size={16} />
                  {user.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-muted hover:text-ink">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted hover:text-ink">
                  Log in
                </Link>
                <Link to="/register" className="btn-accent px-5 py-2 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="p-2 md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="mt-2 flex flex-col gap-1 rounded-3xl border border-slateline bg-white p-4 shadow-soft md:hidden">
            <NavLink to="/" className={navLinkClass} end onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/hotels" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Hotels
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Contact Us
            </NavLink>
            <div className="mt-2 flex flex-col gap-2 border-t border-slateline pt-3">
              {user ? (
                <>
                  <Link to={dashboardPathByRole[user.role]} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-left text-muted">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/register" className="btn-accent text-sm" onClick={() => setIsMenuOpen(false)}>
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
