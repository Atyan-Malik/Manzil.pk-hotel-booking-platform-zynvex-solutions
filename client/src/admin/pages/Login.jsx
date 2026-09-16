
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuth } from "../context/AdminAuthContext";

const Login = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(form.email.trim(), form.password);

      navigate(location.state?.from || "/admin", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink px-4 py-8 sm:px-6">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Main Card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              {/* Left Brand Panel */}
              <div className="relative flex flex-col justify-between bg-surface-panel p-7 sm:p-9">
                {/* Decorative element */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-ink">
                    M.
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Admin Portal
                  </p>

                  <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    Manage Manzil.pk
                    <br />
                    with confidence.
                  </h1>

                  <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                    Manage hotels, rooms, bookings, users, and platform
                    operations from one place.
                  </p>
                </div>

                <div className="relative mt-8 hidden items-center gap-2 text-xs text-white/35 md:flex">
                  <ShieldCheck size={15} />
                  Secure administrator access
                </div>
              </div>

              {/* Right Form */}
              <div className="p-7 sm:p-9">
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-ink">
                    Welcome back
                  </h2>

                  <p className="mt-1.5 text-sm text-ink-faint">
                    Sign in to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-ink"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@manzil.pk"
                      className="h-11 w-full rounded-xl border border-line bg-surface-muted px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-ink"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="h-11 w-full rounded-xl border border-line bg-surface-muted px-4 pr-12 text-sm text-ink outline-none transition placeholder:text-ink-faint/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-ink"
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
                    disabled={loading}
                    className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-ink transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in to dashboard
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Security note */}
                <div className="mt-5 flex items-center gap-2.5 border-t border-line pt-4">
                  <ShieldCheck
                    size={15}
                    className="shrink-0 text-ink-faint"
                  />

                  <p className="text-xs text-ink-faint">
                    Authorized Manzil.pk administrators only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-white/25">
            © {new Date().getFullYear()} Manzil.pk · Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
