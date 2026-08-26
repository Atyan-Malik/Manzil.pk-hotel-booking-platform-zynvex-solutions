import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../utils/helpers";
import { ROLES } from "../utils/constants";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: ROLES.CUSTOMER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await register(formData);
      toast.success(`Welcome to SafarStay, ${user.name.split(" ")[0]}`);
      navigate(user.role === ROLES.HOTEL_MANAGER ? "/manager/dashboard" : "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-page flex min-h-[85vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-muted">Book stays or list your hotel on SafarStay.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: ROLES.CUSTOMER })}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                formData.role === ROLES.CUSTOMER ? "border-accent bg-accent/10 text-ink" : "border-slateline text-muted"
              }`}
            >
              I'm a Traveler
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: ROLES.HOTEL_MANAGER })}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                formData.role === ROLES.HOTEL_MANAGER ? "border-accent bg-accent/10 text-ink" : "border-slateline text-muted"
              }`}
            >
              I own a Hotel
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slateline px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
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
            <label className="text-sm font-medium text-ink">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
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
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slateline px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-accent w-full py-3">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink hover:text-accent-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
