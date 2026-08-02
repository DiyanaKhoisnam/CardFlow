import React from 'react';
import { AdminDashboardSummary } from '../../types/admin.types';
import { Users, CreditCard, ShieldAlert, TrendingUp } from 'lucide-react';

interface AdminSummaryCardsProps {
  totalUsers?: number;
  activeCards?: number;
  blockedCards?: number;
  monthlyTransactionsVolume?: number;
  pendingApplicationsCount?: number;
  summary?: AdminDashboardSummary;
}

export const AdminSummaryCards: React.FC<AdminSummaryCardsProps> = (props) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const s = props.summary?.summary;

  const usersCount = s?.totalUsers ?? props.totalUsers ?? 0;
  const cardsCount = s?.activeCards ?? props.activeCards ?? 0;
  const blockedCount = s?.blockedCards ?? props.blockedCards ?? 0;
  const volume = s?.monthlyTransactionsVolume ?? props.monthlyTransactionsVolume ?? 0;
  const pendingCount = s?.pendingApplicationsCount ?? props.pendingApplicationsCount ?? 0;

  const cards = [
    {
      title: 'Total System Users',
      value: usersCount.toLocaleString(),
      subtitle: `Registered Customer Accounts`,
      icon: <Users className="w-4 h-4 text-blue-600" />,
    },
    {
      title: 'Active Cards Portfolio',
      value: cardsCount.toLocaleString(),
      subtitle: `${pendingCount} Applications Pending Review`,
      icon: <CreditCard className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Blocked / Frozen Cards',
      value: blockedCount.toLocaleString(),
      subtitle: 'Restricted for security override',
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
    },
    {
      title: 'Monthly Volume',
      value: formatCurrency(volume),
      subtitle: `System Transactions Logged`,
      icon: <TrendingUp className="w-4 h-4 text-slate-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
            <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
              {card.icon}
            </div>
          </div>

          <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</div>
          <p className="text-xs text-slate-500">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
