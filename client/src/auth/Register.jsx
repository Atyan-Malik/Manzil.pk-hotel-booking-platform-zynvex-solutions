
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Hotel,
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await register(formData);

      toast.success(
        `Welcome to  Manzil.Pk, ${user.name.split(" ")[0]}`
      );

      navigate(
        user.role === ROLES.HOTEL_MANAGER ? "/owner" : "/"
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHotelManager = formData.role === ROLES.HOTEL_MANAGER;

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-surface-muted">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
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
                Welcome to  Manzil.Pk 
              </p>

              <h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight xl:text-4xl">
                Your next stay starts here.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                Create your account and discover comfortable stays,
                trusted hotels, and memorable journeys across Pakistan.
              </p>
            </div>

            <div className="relative mt-10 space-y-4">
              <Benefit text="Discover hotels with confidence" />
              <Benefit text="Manage your bookings in one place" />
              <Benefit text="Simple, secure and seamless travel" />
            </div>
          </div>

          {/* Form panel */}
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
                  Get started
                </p>

                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  Create your account
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                  Join  Manzil.Pk to book your next stay or manage your
                  hotel with ease.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Role selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                    I want to
                  </label>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <RoleButton
                      active={!isHotelManager}
                      icon={MapPin}
                      title="Travel"
                      description="Book stays"
                      onClick={() =>
                        handleRoleChange(ROLES.CUSTOMER)
                      }
                    />

                    <RoleButton
                      active={isHotelManager}
                      icon={Hotel}
                      title="Host"
                      description="List my hotel"
                      onClick={() =>
                        handleRoleChange(ROLES.HOTEL_MANAGER)
                      }
                    />
                  </div>
                </div>

                {/* Name */}
                <InputField
                  label="Full name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={UserRound}
                  required
                />

                {/* Email */}
                <InputField
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
                />

                {/* Phone */}
                <InputField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                />

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
                  >
                    Password
                  </label>

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
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-11 text-sm text-ink outline-none transition-all placeholder:text-ink-faint hover:border-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
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

                  <p className="mt-1.5 text-[11px] text-ink-faint">
                    Use at least 6 characters.
                  </p>
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="mt-7 border-t border-line pt-6 text-center">
                <p className="text-sm text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-ink transition-colors hover:text-accent-dark"
                  >
                    Log in
                  </Link>
                </p>
              </div>

              {/* Trust note */}
              <p className="mt-5 text-center text-[11px] leading-5 text-ink-faint">
                By creating an account, you can securely manage your
                bookings and  Manzil.Pk profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Reusable input
------------------------------------------------------- */

const InputField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <Icon
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
        />

        <input
          id={name}
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-ink-faint hover:border-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Role selection
------------------------------------------------------- */

const RoleButton = ({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex min-h-[78px] items-center gap-3 rounded-xl border
        px-3.5 py-3 text-left transition-all duration-200
        ${
          active
            ? "border-primary bg-primary-light/70 shadow-sm"
            : "border-line bg-white hover:border-ink-faint hover:bg-surface-muted"
        }
      `}
    >
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
          ${
            active
              ? "bg-primary text-ink"
              : "bg-surface-muted text-ink-soft"
          }
        `}
      >
        <Icon size={17} strokeWidth={2.2} />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted">{description}</p>
      </div>

      {active && (
        <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-ink">
          <Check size={12} strokeWidth={3} />
        </div>
      )}
    </button>
  );
};

/* -------------------------------------------------------
   Brand benefit
------------------------------------------------------- */

const Benefit = ({ text }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check size={14} strokeWidth={2.5} />
      </div>

      <span className="text-sm text-white/70">{text}</span>
    </div>
  );
};

export default Register;
