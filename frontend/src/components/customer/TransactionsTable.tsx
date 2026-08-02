import React, { useState } from 'react';
import { Transaction, TransactionCategory, TransactionStatus, Pagination } from '../../types/customer.types';
import { Search, Download, ChevronLeft, ChevronRight, SlidersHorizontal, Tag } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { exportTransactionsToCSV } from '../../utils/export.utils';

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination?: Pagination;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: TransactionCategory | '';
  onCategoryChange: (category: TransactionCategory | '') => void;
  selectedStatus: TransactionStatus | '';
  onStatusChange: (status: TransactionStatus | '') => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  pagination,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onPageChange,
  isLoading = false,
}) => {
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxAmount, setMaxAmount] = useState<number | ''>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const filteredTransactions = transactions.filter((tx) => {
    if (minAmount !== '' && tx.amount < minAmount) return false;
    if (maxAmount !== '' && tx.amount > maxAmount) return false;
    return true;
  });

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="success">COMPLETED</Badge>;
      case 'PENDING': return <Badge variant="warning">PENDING</Badge>;
      case 'FAILED': return <Badge variant="danger">FAILED</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden space-y-4">
      {/* Controls Header & Export Actions */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search merchants or transactions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportTransactionsToCSV(filteredTransactions)}
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filter Controls Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value as TransactionCategory | '')}
                className="w-full bg-white border border-slate-300 rounded-md text-xs px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="SHOPPING">Shopping</option>
                <option value="DINING">Dining</option>
                <option value="TRAVEL">Travel</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="UTILITIES">Utilities</option>
                <option value="GROCERIES">Groceries</option>
                <option value="HEALTH">Health</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value as TransactionStatus | '')}
                className="w-full bg-white border border-slate-300 rounded-md text-xs px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Min Amount ($)</label>
              <input
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full bg-white border border-slate-300 rounded-md text-xs px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Max Amount ($)</label>
              <input
                type="number"
                placeholder="5000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full bg-white border border-slate-300 rounded-md text-xs px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Enterprise Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="enterprise-table-header">Merchant</th>
              <th className="enterprise-table-header">Category</th>
              <th className="enterprise-table-header">Date</th>
              <th className="enterprise-table-header">Status</th>
              <th className="enterprise-table-header text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Loading transaction ledger...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="enterprise-table-row">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    <div>{tx.merchant}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{tx.card?.cardNumber || 'Card'}</div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 font-medium capitalize">
                    {tx.category.toLowerCase()}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="px-4 py-3.5">
                    {getStatusBadge(tx.status)}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    -{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalCount} records)
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
