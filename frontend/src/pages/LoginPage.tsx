import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CreditCard, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Simple Header */}
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

        <Link to="/register" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          Create Account &rarr;
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto">
        <div className="bg-white py-8 px-6 border border-slate-200 rounded-lg shadow-sm sm:px-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to CardFlow</h2>
            <p className="text-xs text-slate-500">Access your credit card accounts and transaction management.</p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" fullWidth isLoading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">Demo Quick Sign-In</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setEmail('customer@example.com'); setPassword('Password123!'); }}
                className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700 text-center"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@example.com'); setPassword('AdminPass123!'); }}
                className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-[11px] font-semibold text-blue-700 text-center"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center text-xs text-slate-400">
        © 2026 CardFlow Financial Inc. All rights reserved.
      </div>
    </div>
  );
};
