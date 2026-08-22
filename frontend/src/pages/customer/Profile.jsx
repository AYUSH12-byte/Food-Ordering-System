import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/profileService";

const Profile = () => {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProfile();

      const profileUser = response.user;

      setProfile({
        name: profileUser?.name || "",
        email: profileUser?.email || "",
        phone: profileUser?.phone || "",
        address: profileUser?.address || "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // PROFILE INPUT CHANGE
  // ==========================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // PASSWORD INPUT CHANGE
  // ==========================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
      });

      // Get updated user from backend
      const updatedUser = response.user;

      // Update local profile state
      setProfile({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
        address: updatedUser?.address || "",
      });

      // Update AuthContext + localStorage
      updateUser(updatedUser);

      setSuccess("Profile updated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Check password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");

      return;
    }

    // Check password length
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");

      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword: passwordData.currentPassword,

        newPassword: passwordData.newPassword,
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password changed successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />

          <div className="h-80 rounded-2xl bg-slate-200" />

          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Profile</h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your account and delivery information.
        </p>
      </div>

      {/* Messages */}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* ========================================
          PERSONAL INFORMATION
      ======================================== */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update your personal and delivery information.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
          {/* Name */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
            />

            <p className="mt-1 text-xs text-slate-400">
              Email cannot be changed here.
            </p>
          </div>

          {/* Phone */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="Enter your phone number"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Address */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Delivery Address
            </label>

            <textarea
              name="address"
              value={profile.address}
              onChange={handleProfileChange}
              placeholder="Enter your delivery address"
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Save */}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ========================================
          CHANGE PASSWORD
      ======================================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Change Password</h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep your account secure by using a strong password.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
          {/* Current Password */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* New Password */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              minLength={6}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />

            <p className="mt-1 text-xs text-slate-400">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              minLength={6}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Change Password */}

          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
