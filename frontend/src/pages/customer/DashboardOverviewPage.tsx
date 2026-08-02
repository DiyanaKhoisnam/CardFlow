import React, { useState } from 'react';
import {
  useDashboardSummaryQuery,
  useUpdateCardStatusMutation,
  useAnalyticsQuery,
} from '../../hooks/useCustomerData';
import { SummaryCards } from '../../components/customer/SummaryCards';
import { CreditCardVisual } from '../../components/customer/CreditCardVisual';
import { TransactionsTable } from '../../components/customer/TransactionsTable';
import { AnalyticsCharts } from '../../components/customer/AnalyticsCharts';
import { Loader2 } from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { data: summaryData, isLoading: isSummaryLoading } = useDashboardSummaryQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAnalyticsQuery();
  const updateCardStatusMutation = useUpdateCardStatusMutation();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<any>('');
  const [status, setStatus] = useState<any>('');

  if (isSummaryLoading || isAnalyticsLoading || !summaryData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Customer Dashboard...</p>
        </div>
      </div>
    );
  }

  const primaryCard = summaryData.cards[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Title Banner */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Monitor your credit limit, transactions, card status, and rewards.</p>
      </div>

      {/* 1. Summary Metrics Cards */}
      <SummaryCards
        creditLimit={summaryData.summary.totalCreditLimit}
        availableCredit={summaryData.summary.totalAvailableCredit}
        outstandingBalance={summaryData.summary.totalOutstandingBalance}
        rewardPoints={summaryData.summary.rewardPoints}
      />

      {/* 2. Main Section: Credit Card Visual & Spending Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {primaryCard && (
            <CreditCardVisual
              card={primaryCard}
              onUpdateStatus={(cardId, status) => updateCardStatusMutation.mutate({ cardId, status })}
              isUpdating={updateCardStatusMutation.isPending}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          {analyticsData && <AnalyticsCharts analytics={analyticsData} />}
        </div>
      </div>

      {/* 3. Recent Transactions Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Recent Transactions Ledger</h3>
        <TransactionsTable
          transactions={summaryData.recentTransactions}
          searchQuery={search}
          onSearchChange={setSearch}
          selectedCategory={category}
          onCategoryChange={setCategory}
          selectedStatus={status}
          onStatusChange={setStatus}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
};
