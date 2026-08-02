import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  LayoutDashboard,
  History,
  Gift,
  FileText,
  PieChart,
  Users,
  CheckSquare,
  Shield,
  User as UserIcon,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const customerNavItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Cards', path: '/cards', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Transactions', path: '/transactions', icon: <History className="w-4 h-4" /> },
    { label: 'Rewards', path: '/rewards', icon: <Gift className="w-4 h-4" /> },
    { label: 'Statements', path: '/statements', icon: <FileText className="w-4 h-4" /> },
    { label: 'Analytics', path: '/analytics', icon: <PieChart className="w-4 h-4" /> },
  ];

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <Shield className="w-4 h-4 text-blue-600" /> },
    { label: 'Users Governance', path: '/admin/users', icon: <Users className="w-4 h-4 text-blue-600" /> },
    { label: 'Card Approvals', path: '/admin/cards', icon: <CheckSquare className="w-4 h-4 text-blue-600" /> },
    { label: 'Transactions', path: '/admin/transactions', icon: <History className="w-4 h-4 text-blue-600" /> },
    { label: 'Enterprise Analytics', path: '/admin/analytics', icon: <PieChart className="w-4 h-4 text-blue-600" /> },
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : customerNavItems;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="h-14 px-5 flex items-center border-b border-slate-100 gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">CardFlow</span>
          {user?.role === 'ADMIN' && (
            <span className="ml-auto px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-700 uppercase border border-blue-200">
              Admin
            </span>
          )}
        </div>

        {/* Navigation Menu Links */}
        <nav className="px-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {user?.role === 'ADMIN' ? 'Administration' : 'Menu'}
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Tile */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
          </div>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
