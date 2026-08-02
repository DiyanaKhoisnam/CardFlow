import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import {
  CreditCard,
  LogOut,
  Shield,
  LayoutDashboard,
  History,
  Gift,
  FileText,
  PieChart,
  Users,
  CheckSquare,
  Search,
  Sun,
  Moon,
  User as UserIcon,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const customerNavItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Cards', path: '/cards', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Transactions', path: '/transactions', icon: <History className="w-4 h-4" /> },
    { label: 'Rewards', path: '/rewards', icon: <Gift className="w-4 h-4" /> },
    { label: 'Statements', path: '/statements', icon: <FileText className="w-4 h-4" /> },
    { label: 'Analytics', path: '/analytics', icon: <PieChart className="w-4 h-4" /> },
  ];

  const adminNavItems = [
    { label: 'Admin Command', path: '/admin/dashboard', icon: <Shield className="w-4 h-4 text-purple-400" /> },
    { label: 'Users Governance', path: '/admin/users', icon: <Users className="w-4 h-4 text-purple-400" /> },
    { label: 'Card Approvals', path: '/admin/cards', icon: <CheckSquare className="w-4 h-4 text-purple-400" /> },
    { label: 'All Transactions', path: '/admin/transactions', icon: <History className="w-4 h-4 text-purple-400" /> },
    { label: 'Enterprise Analytics', path: '/admin/analytics', icon: <PieChart className="w-4 h-4 text-purple-400" /> },
  ];

  const activeNavItems = user?.role === 'ADMIN' ? adminNavItems : customerNavItems;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Nav Links */}
          <div className="flex items-center gap-6">
            <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CardFlow
              </span>
            </Link>

            {/* Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1">
                {activeNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? user?.role === 'ADMIN'
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Action Tools & User Menu */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-input text-slate-400 hover:text-white text-xs transition"
                title="Search Everywhere (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">⌘K</kbd>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-input text-slate-400 hover:text-white transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Authenticated User Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                        : 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                    }`}
                  >
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-slate-200 group-hover:text-white">
                    {user.firstName}
                  </span>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </Button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg glass-input text-slate-400 hover:text-white"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-in slide-in-from-top-2">
            {activeNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Command-K Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
