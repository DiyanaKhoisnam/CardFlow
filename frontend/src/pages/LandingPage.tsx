import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import {
  CreditCard,
  Shield,
  History,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  PieChart,
  Users,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    return user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-100">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">CardFlow</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button variant="primary" size="sm" className="gap-1.5">
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Enterprise Credit Card & Financial Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            The modern credit card platform for enterprise teams
          </h1>

          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Issue corporate cards, control spending limits in real time, monitor automated MCC-categorized transactions, and enforce strict role governance in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" fullWidth className="gap-2 shadow-sm">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth>
                View Live Demo Account
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Dual JWT Security</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> OpenAPI Documentation</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Role-Based Access</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Card Controls & Lifecycle</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant credit card status controls. Freeze cards temporarily for misplaced cards, or block compromised cards permanently.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Automated MCC Categorization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transactions are categorized automatically via Merchant Category Codes into Shopping, Dining, Travel, Groceries, and Utilities.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Admin Command Center</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review pending card applications, suspend/activate user accounts, audit system transaction ledgers, and analyze enterprise volume.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">Ready to experience CardFlow?</h3>
            <p className="text-xs text-slate-500">Sign up in 30 seconds or sign in using pre-configured demo credentials.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/register" className="flex-1 md:flex-none">
              <Button variant="primary" size="md">Create Account</Button>
            </Link>
            <Link to="/login" className="flex-1 md:flex-none">
              <Button variant="secondary" size="md">Sign In</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              C
            </div>
            <span className="font-bold text-slate-900">CardFlow</span>
            <span>— Enterprise Credit Card Platform</span>
          </div>
          <div>© 2026 CardFlow Financial Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
