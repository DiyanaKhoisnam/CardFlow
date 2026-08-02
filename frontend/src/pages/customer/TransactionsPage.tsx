import React, { useState } from 'react';
import { useTransactionsQuery } from '../../hooks/useCustomerData';
import { TransactionsTable } from '../../components/customer/TransactionsTable';
import { TransactionCategory, TransactionStatus } from '../../types/customer.types';

export const TransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [status, setStatus] = useState<TransactionStatus | ''>('');

  const { data, isLoading } = useTransactionsQuery({
    page,
    limit: 10,
    search,
    category,
    status,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Transaction History</h1>
        <p className="text-sm text-slate-400">Search, filter, and review all credit card transactions.</p>
      </div>

      <TransactionsTable
        transactions={data?.transactions || []}
        pagination={data?.pagination}
        searchQuery={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        selectedCategory={category}
        onCategoryChange={(c) => { setCategory(c); setPage(1); }}
        selectedStatus={status}
        onStatusChange={(s) => { setStatus(s); setPage(1); }}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading}
      />
    </div>
  );
};
