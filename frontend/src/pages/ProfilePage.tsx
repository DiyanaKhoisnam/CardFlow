import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { User, Key, Lock, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      await api.patch('/auth/profile', { firstName, lastName });
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', 'warning');
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.post('/auth/change-password', { currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account & Security Settings</h2>
        <p className="text-xs text-slate-500">Manage user profile details, password security, and system role access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Personal Profile</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              className="bg-slate-50 opacity-75 cursor-not-allowed text-slate-500"
            />

            <div className="pt-1">
              <span className="text-xs font-semibold text-slate-600 block mb-1">Account Role</span>
              {user?.role === 'ADMIN' ? (
                <Badge variant="info">ADMINISTRATOR</Badge>
              ) : (
                <Badge variant="neutral">CUSTOMER</Badge>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isUpdatingProfile}>
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Change Password Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Change Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="space-y-1 text-[11px] text-slate-500">
              <div className={`flex items-center gap-1 ${newPassword.length >= 8 ? 'text-emerald-600 font-semibold' : ''}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> At least 8 characters
              </div>
              <div className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-semibold' : ''}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> At least 1 uppercase letter
              </div>
            </div>

            <Button type="submit" variant="secondary" fullWidth isLoading={isChangingPassword}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
