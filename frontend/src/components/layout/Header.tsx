import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { Search, Bell, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Account Overview';
      case '/cards': return 'Credit Cards Portfolio';
      case '/transactions': return 'Transaction History';
      case '/rewards': return 'Rewards Catalog';
      case '/statements': return 'Monthly Statements';
      case '/analytics': return 'Spending Analytics';
      case '/admin/dashboard': return 'Admin Command Center';
      case '/admin/users': return 'User Governance';
      case '/admin/cards': return 'Card Approvals & Controls';
      case '/admin/transactions': return 'System Transactions Audit';
      case '/admin/analytics': return 'Enterprise Analytics';
      case '/profile': return 'Account & Security Settings';
      default: return 'CardFlow System';
    }
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Page Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">{getPageTitle()}</h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Production
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-xs transition-all"
            title="Search Everywhere (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline px-1 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400">⌘K</kbd>
          </button>

          {/* Notifications Bell */}
          <button className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
