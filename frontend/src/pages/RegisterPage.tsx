import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CreditCard, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!hasUppercase) {
      setError('Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!hasLowercase) {
      setError('Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!hasNumber) {
      setError('Password must contain at least one number (0-9).');
      return;
    }

    setLoading(true);

    try {
      await register({ firstName, lastName, email, password, role: 'CUSTOMER' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition">
          &larr; Back to Home
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
            <CreditCard className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-slate-900">CardFlow</span>
        </div>

        <Link to="/login" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          Already have an account? Sign In &rarr;
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto">
        <div className="bg-white py-8 px-6 border border-slate-200 rounded-lg shadow-sm sm:px-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your CardFlow account</h2>
            <p className="text-xs text-slate-500">Get started with modern card issuing and financial management.</p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="Eren"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Yeager"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Work Email"
              type="email"
              placeholder="eren@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars (1 upper, 1 lower, 1 number)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Password Requirements Helper Checklist */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> 8+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Uppercase (A-Z)
                  </div>
                  <div className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Lowercase (a-z)
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Number (0-9)
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={loading}>
              Create Account
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        © 2026 CardFlow Financial Inc. All rights reserved.
      </div>
    </div>
  );
};
