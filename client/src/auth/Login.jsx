import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../utils/helpers";
import { ROLES } from "../utils/constants";

const dashboardPathByRole = {
  [ROLES.CUSTOMER]: "/",
  [ROLES.HOTEL_MANAGER]: "/owner",
  [ROLES.ADMIN]: "/admin/dashboard",
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login(formData);

      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);

      navigate(dashboardPathByRole[user.role]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-surface-muted">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="container-page relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_25px_80px_-30px_rgba(18,20,15,0.28)] lg:grid lg:grid-cols-[0.85fr_1.15fr]">
          
          {/* Brand panel */}
          <div className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-primary/20" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-primary/10" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-primary/5 blur-2xl" />

            <div className="relative">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-ink shadow-lg shadow-primary/10">
                <MapPin size={23} strokeWidth={2.3} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Welcome back
              </p>

              <h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight xl:text-4xl">
                Your journey is waiting.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                Sign in to access your bookings, discover new stays,
                and continue planning your next journey with Manzil.Pk.
              </p>
            </div>

            <div className="relative mt-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/40">
                  Manzil.Pk
                </p>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Comfortable stays. Trusted hotels. Memorable journeys.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  Everything in one place
                </div>
              </div>
            </div>
          </div>

          {/* Login panel */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="mx-auto max-w-lg">
              {/* Mobile brand */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-ink">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="font-display text-lg font-extrabold text-ink">
                     Manzil.Pk
                  </p>
                  <p className="text-[11px] text-muted">
                    Stay. Explore. Remember.
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-dark">
                  Sign in
                </p>

                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                  Log in to manage your bookings and continue your
                  journey with  Manzil.Pk.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
                  >
                    Email address
                  </label>

                  <div className="relative mt-2">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-line bg-white py-3.5 pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-ink-faint hover:border-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-ink-soft transition-colors hover:text-accent-dark"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative mt-2">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-line bg-white py-3.5 pl-10 pr-11 text-sm text-ink outline-none transition-all placeholder:text-ink-faint hover:border-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log In
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-line" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  New to  Manzil.Pk?
                </span>
                <div className="h-px flex-1 bg-line" />
              </div>

              {/* Register */}
              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-bold text-ink transition-all duration-200 hover:border-ink-faint hover:bg-surface-muted"
              >
                Create an account
              </Link>

              <p className="mt-5 text-center text-[11px] leading-5 text-ink-faint">
                Securely access your  Manzil.Pk account and manage
                everything from one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;