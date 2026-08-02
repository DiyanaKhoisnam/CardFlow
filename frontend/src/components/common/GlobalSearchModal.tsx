import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CreditCard, History, Gift, Shield, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchItems = [
    { title: 'Customer Dashboard Overview', path: '/dashboard', role: 'CUSTOMER', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
    { title: 'My Credit Cards Portfolio', path: '/cards', role: 'CUSTOMER', icon: <CreditCard className="w-4 h-4 text-emerald-600" /> },
    { title: 'Transaction History Ledger', path: '/transactions', role: 'CUSTOMER', icon: <History className="w-4 h-4 text-slate-600" /> },
    { title: 'Rewards & Vouchers Portal', path: '/rewards', role: 'CUSTOMER', icon: <Gift className="w-4 h-4 text-amber-600" /> },
    { title: 'Profile & Security Settings', path: '/profile', role: 'ALL', icon: <User className="w-4 h-4 text-slate-600" /> },
    { title: 'Admin Command Center', path: '/admin/dashboard', role: 'ADMIN', icon: <Shield className="w-4 h-4 text-blue-600" /> },
    { title: 'User Governance & Suspension', path: '/admin/users', role: 'ADMIN', icon: <User className="w-4 h-4 text-blue-600" /> },
    { title: 'Credit Card Approvals', path: '/admin/cards', role: 'ADMIN', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
  ];

  const filteredItems = searchItems.filter(
    (item) =>
      (item.role === 'ALL' || item.role === user?.role) &&
      item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden space-y-2 p-3">
        {/* Search Bar Header */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a page command (e.g. Cards, Transactions, Profile)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-64 overflow-y-auto space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No shortcuts found matching "{query}".
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleSelect(item.path)}
                className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-slate-50 text-xs font-medium text-slate-700 transition group text-left"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
