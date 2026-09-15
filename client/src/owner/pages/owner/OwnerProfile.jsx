import { useState } from "react";
import { Save, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../../services/api";
import useAuth from "../../../hooks/useAuth";

const inputClass =
  "w-full rounded-xl border border-[#E2E8DE] bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-[#8FE13D] focus:ring-2 focus:ring-[#8FE13D]/30";

// NOTE: authService.js wasn't available when this page was built, so it calls
// the API directly. These paths mirror authController.updateMe /
// updatePassword (PATCH /auth/me and PATCH /auth/update-password) — confirm
// against your actual authRoutes.js and adjust if different, ideally moving
// these two calls into authService.js alongside login/register/getMe.
const updateMe = (payload) => api.patch("/auth/update-me", payload).then((res) => res.data);
const updatePassword = (payload) => api.patch("/auth/update-password", payload).then((res) => res.data);

const OwnerProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const data = await updateMe(form);
      updateUser(data.user);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      toast.error("Fill in both password fields.");
      return;
    }
    setSavingPw(true);
    try {
      await updatePassword(pwForm);
      setPwForm({ currentPassword: "", newPassword: "" });
      toast.success("Password changed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password.");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Profile</h1>
        <p className="mt-1 text-sm text-muted">Manage your account information.</p>
      </div>

      <form
        onSubmit={handleProfileSubmit}
        className="space-y-4 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6"
      >
        <h2 className="font-display text-sm font-bold text-ink">Account Details</h2>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink">Full Name</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink">Phone</span>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink">Email</span>
          <input
            className={`${inputClass} bg-[#F8FAF5] text-muted`}
            value={user?.email || ""}
            disabled
          />
          <span className="mt-1 block text-xs text-muted">Email cannot be changed here.</span>
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8FE13D] px-5 py-2.5 text-sm font-bold text-[#17210F] transition hover:bg-[#9BEA4E] disabled:opacity-60"
          >
            <Save size={16} />
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="space-y-4 rounded-[1.5rem] border border-[#E2E8DE] bg-white p-5 sm:p-6"
      >
        <h2 className="font-display text-sm font-bold text-ink">Change Password</h2>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink">Current Password</span>
          <input
            type="password"
            className={inputClass}
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink">New Password</span>
          <input
            type="password"
            className={inputClass}
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPw}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8DE] px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-[#F1F6EC] disabled:opacity-60"
          >
            <KeyRound size={16} />
            {savingPw ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerProfile;
