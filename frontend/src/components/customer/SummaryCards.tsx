import React from 'react';
import { CreditCard, DollarSign, Wallet, Gift } from 'lucide-react';

interface SummaryCardsProps {
  creditLimit: number;
  availableCredit: number;
  outstandingBalance: number;
  rewardPoints: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  creditLimit,
  availableCredit,
  outstandingBalance,
  rewardPoints,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const cards = [
    {
      title: 'Credit Limit',
      value: formatCurrency(creditLimit),
      subtitle: 'Total authorized limit across active cards',
      icon: <CreditCard className="w-4 h-4 text-blue-600" />,
    },
    {
      title: 'Available Credit',
      value: formatCurrency(availableCredit),
      subtitle: 'Ready for spending & purchase approvals',
      icon: <Wallet className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Outstanding Balance',
      value: formatCurrency(outstandingBalance),
      subtitle: 'Current monthly statement balance due',
      icon: <DollarSign className="w-4 h-4 text-slate-600" />,
    },
    {
      title: 'Reward Points Balance',
      value: `${(rewardPoints || 0).toLocaleString()} PTS`,
      subtitle: 'Available to redeem for cashback & vouchers',
      icon: <Gift className="w-4 h-4 text-amber-600" />,
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
          <p className="text-xs text-slate-500 leading-normal">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
