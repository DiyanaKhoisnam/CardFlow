import React from 'react';
import { Transaction, Pagination } from '../../types/customer.types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface AdminTransactionsTableProps {
  transactions: Transaction[];
  pagination?: Pagination;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const AdminTransactionsTable: React.FC<AdminTransactionsTableProps> = ({
  transactions,
  pagination,
  searchQuery,
  onSearchChange,
  onPageChange,
  isLoading = false,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search system transactions or merchants..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <span className="text-xs text-slate-500 font-semibold">System Audit Ledger</span>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="enterprise-table-header">User & Card</th>
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
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Loading system transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  No system transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="enterprise-table-row">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    <div>{tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : 'System User'}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{tx.card?.cardNumber || 'Card'}</div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-900 font-medium">
                    {tx.merchant}
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 capitalize">
                    {tx.category.toLowerCase()}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="px-4 py-3.5">
                    {tx.status === 'COMPLETED' ? (
                      <Badge variant="success">COMPLETED</Badge>
                    ) : tx.status === 'PENDING' ? (
                      <Badge variant="warning">PENDING</Badge>
                    ) : (
                      <Badge variant="danger">FAILED</Badge>
                    )}
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalCount} transactions)
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
