import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { DashboardCard } from '../components/Cards';
import { Badge } from '../components/UIStates';
import {
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  GraduationCap,
  Save,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        toast.success('Profile details updated successfully');
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (res.data.success) {
        toast.success('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#F0D9D5] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F4A6A6&color=fff`
          }
          alt={user?.name}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-[#FFD6C9] shadow-md flex-shrink-0"
        />

        <div className="text-center sm:text-left space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-[#2D2526]">{user?.name}</h1>
            <Badge variant="peach" size="sm">
              {user?.role?.replace('_', ' ')}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-[#6F6264] font-medium">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-[#6F6264]">
            {profile?.rollNumber && (
              <span className="font-mono bg-[#FFF5F1] px-2.5 py-1 rounded-lg font-bold text-[#A95763] border border-[#F0D9D5]">
                Roll No: {profile.rollNumber}
              </span>
            )}
            {profile?.employeeId && (
              <span className="font-mono bg-[#FFF5F1] px-2.5 py-1 rounded-lg font-bold text-[#A95763] border border-[#F0D9D5]">
                Emp ID: {profile.employeeId}
              </span>
            )}
            {profile?.cgpa && (
              <span className="bg-[#FFF5F1] text-[#A95763] px-2.5 py-1 rounded-lg font-bold border border-[#F0D9D5]">
                CGPA: {Number(profile.cgpa).toFixed(2)}
              </span>
            )}
            {profile?.designation && (
              <span className="bg-[#FFF5F1] text-[#A95763] px-2.5 py-1 rounded-lg font-bold border border-[#F0D9D5]">
                {profile.designation}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <DashboardCard title="Personal Information" subtitle="Update your contact details and avatar">
          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="peach-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2831"
                  className="peach-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Profile Avatar URL</label>
              <input
                type="url"
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="peach-input"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="peach-button-primary w-full space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </DashboardCard>

        {/* Change Password */}
        <DashboardCard title="Security & Authentication" subtitle="Change your account login password">
          <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="peach-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2D2526] mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="peach-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="peach-input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="peach-button-secondary w-full space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </DashboardCard>
      </div>
    </div>
  );
};
