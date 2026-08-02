import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CreditCard, Lock, Mail, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register({ firstName, lastName, email, password, role: 'CUSTOMER' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Simple Header */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
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
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Work Email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" fullWidth isLoading={loading}>
              Create Account
            </Button>
          </form>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center text-xs text-slate-400">
        © 2026 CardFlow Financial Inc. All rights reserved.
      </div>
    </div>
  );
};
