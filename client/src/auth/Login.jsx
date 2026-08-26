import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../utils/helpers";
import { ROLES } from "../utils/constants";

const dashboardPathByRole = {
  [ROLES.CUSTOMER]: "/",
  [ROLES.HOTEL_MANAGER]: "/manager/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <div className="container-page flex min-h-[75vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to manage your bookings.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slateline px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slateline px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-accent w-full py-3">
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-ink hover:text-accent-dark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
