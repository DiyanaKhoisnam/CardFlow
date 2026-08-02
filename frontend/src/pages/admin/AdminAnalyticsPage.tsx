import React from 'react';
import { useAdminAnalyticsQuery } from '../../hooks/useAdminData';
import { AdminAnalyticsCharts } from '../../components/admin/AdminAnalyticsCharts';
import { Loader2 } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { data: analytics, isLoading } = useAdminAnalyticsQuery();

  if (isLoading || !analytics) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Analytics & System Volume</h1>
        <p className="text-sm text-slate-400">User acquisition growth, card portfolio distribution, and system volume metrics.</p>
      </div>

      <AdminAnalyticsCharts analytics={analytics} />
    </div>
  );
};
