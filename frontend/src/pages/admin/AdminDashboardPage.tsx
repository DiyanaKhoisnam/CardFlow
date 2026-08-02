import React from 'react';
import {
  useAdminDashboardSummaryQuery,
  useApproveCardMutation,
  useRejectCardMutation,
  useAdminAnalyticsQuery,
} from '../../hooks/useAdminData';
import { AdminSummaryCards } from '../../components/admin/AdminSummaryCards';
import { AdminAnalyticsCharts } from '../../components/admin/AdminAnalyticsCharts';
import { AdminCardsTable } from '../../components/admin/AdminCardsTable';
import { Loader2, ShieldCheck } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data: summaryData, isLoading: isSummaryLoading } = useAdminDashboardSummaryQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAdminAnalyticsQuery();
  const approveMutation = useApproveCardMutation();
  const rejectMutation = useRejectCardMutation();

  if (isSummaryLoading || isAnalyticsLoading || !summaryData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Admin Command Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Command Center</h1>
          <p className="text-sm text-slate-400">Enterprise system oversight, credit line approvals, and user governance.</p>
        </div>
      </div>

      {/* 1. Top KPI Summary Cards */}
      <AdminSummaryCards
        totalUsers={summaryData.summary.totalUsers}
        activeCards={summaryData.summary.activeCards}
        blockedCards={summaryData.summary.blockedCards}
        monthlyTransactionsVolume={summaryData.summary.monthlyTransactionsVolume}
        pendingApplicationsCount={summaryData.summary.pendingApplicationsCount}
      />

      {/* 2. Pending Applications Quick Action Section */}
      {summaryData.recentPendingCards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              Pending Credit Card Applications ({summaryData.summary.pendingApplicationsCount})
            </h3>
          </div>
          <AdminCardsTable
            cards={summaryData.recentPendingCards}
            selectedStatus=""
            onStatusChange={() => {}}
            selectedAppStatus="PENDING"
            onAppStatusChange={() => {}}
            onPageChange={() => {}}
            onApprove={(id) => approveMutation.mutate(id)}
            onReject={(id) => rejectMutation.mutate(id)}
            onUpdateStatus={() => {}}
            isProcessing={approveMutation.isPending || rejectMutation.isPending}
          />
        </div>
      )}

      {/* 3. System Analytics Charts */}
      {analyticsData && <AdminAnalyticsCharts analytics={analyticsData} />}
    </div>
  );
};
