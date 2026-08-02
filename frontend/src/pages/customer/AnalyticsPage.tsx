import React from 'react';
import { useAnalyticsQuery } from '../../hooks/useCustomerData';
import { AnalyticsCharts } from '../../components/customer/AnalyticsCharts';
import { Loader2, DollarSign } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { data: analytics, isLoading } = useAnalyticsQuery();

  if (isLoading || !analytics) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Spending Analytics & Insights</h1>
          <p className="text-sm text-slate-400">Detailed breakdown of monthly expenditure and category trends.</p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-emerald-500/30">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Spent</div>
            <div className="font-extrabold text-emerald-400 font-mono">{formatCurrency(analytics.totalSpent)}</div>
          </div>
        </div>
      </div>

      <AnalyticsCharts analytics={analytics} />
    </div>
  );
};
