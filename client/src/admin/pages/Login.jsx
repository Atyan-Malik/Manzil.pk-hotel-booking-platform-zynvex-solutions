import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuth } from "../context/AdminAuthContext";

const Login = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not log in. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-panel px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-lg font-extrabold text-ink">
            M.
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-white">Manzil.pk Admin</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage hotels and bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl2 bg-white p-6 shadow-soft">
          <label className="field-label">Email address</label>
          <input
            type="email"
            required
            className="field-input"
            placeholder="you@manzil.pk"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="field-label mt-4">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="field-input pr-10"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
