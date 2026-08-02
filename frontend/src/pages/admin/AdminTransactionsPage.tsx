import React, { useState } from 'react';
import { useAdminTransactionsQuery } from '../../hooks/useAdminData';
import { AdminTransactionsTable } from '../../components/admin/AdminTransactionsTable';

export const AdminTransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAdminTransactionsQuery({
    page,
    limit: 10,
    search,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System-Wide Transaction Ledger</h1>
        <p className="text-sm text-slate-400">Audit all transactions processed across customer accounts.</p>
      </div>

      <AdminTransactionsTable
        transactions={data?.transactions || []}
        pagination={data?.pagination}
        searchQuery={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading}
      />
    </div>
  );
};
