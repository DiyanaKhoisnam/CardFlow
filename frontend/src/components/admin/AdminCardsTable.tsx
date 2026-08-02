import React from 'react';
import { Card as CardType, CardStatus } from '../../types/customer.types';
import { CardApplicationStatus, AdminCard } from '../../types/admin.types';
import { Pagination } from '../../types/customer.types';
import { Check, X, Snowflake, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface AdminCardsTableProps {
  cards: AdminCard[];
  pagination?: Pagination;
  selectedStatus: CardStatus | '';
  onStatusChange: (status: CardStatus | '') => void;
  selectedAppStatus: CardApplicationStatus | '';
  onAppStatusChange: (appStatus: CardApplicationStatus | '') => void;
  onPageChange: (page: number) => void;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onUpdateStatus: (cardId: string, status: CardStatus) => void;
  isProcessing?: boolean;
  isLoading?: boolean;
}

export const AdminCardsTable: React.FC<AdminCardsTableProps> = ({
  cards,
  pagination,
  selectedStatus,
  onStatusChange,
  selectedAppStatus,
  onAppStatusChange,
  onPageChange,
  onApprove,
  onReject,
  onUpdateStatus,
  isProcessing = false,
  isLoading = false,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getAppStatusBadge = (appStatus: CardApplicationStatus) => {
    switch (appStatus) {
      case 'APPROVED': return <Badge variant="success">APPROVED</Badge>;
      case 'PENDING': return <Badge variant="warning">PENDING REVIEW</Badge>;
      case 'REJECTED': return <Badge variant="danger">REJECTED</Badge>;
      default: return <Badge variant="neutral">{appStatus}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden space-y-4">
      {/* Filters Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-bold text-slate-900 text-sm">Credit Cards & Application Governance</h3>

        <div className="flex items-center gap-2">
          <select
            value={selectedAppStatus}
            onChange={(e) => onAppStatusChange(e.target.value as CardApplicationStatus | '')}
            className="bg-white border border-slate-300 rounded-md text-xs px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="">All Applications</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as CardStatus | '')}
            className="bg-white border border-slate-300 rounded-md text-xs px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="">All Card Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="FROZEN">Frozen</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="enterprise-table-header">Cardholder</th>
              <th className="enterprise-table-header">Type & Number</th>
              <th className="enterprise-table-header">Limit</th>
              <th className="enterprise-table-header">Application</th>
              <th className="enterprise-table-header">Status</th>
              <th className="enterprise-table-header text-right">Admin Controls</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Loading credit cards...
                </td>
              </tr>
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  No credit cards found matching criteria.
                </td>
              </tr>
            ) : (
              cards.map((card) => (
                <tr key={card.id} className="enterprise-table-row">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    <div>{card.cardHolder}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{card.user?.email || 'N/A'}</div>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-medium text-slate-800">
                    {card.cardType.replace('_', ' ')} (•••• {card.cardNumber.slice(-4)})
                  </td>

                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {formatCurrency(card.creditLimit)}
                  </td>

                  <td className="px-4 py-3.5">
                    {getAppStatusBadge(card.applicationStatus)}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="capitalize text-slate-600 font-semibold">{card.status.toLowerCase()}</span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {card.applicationStatus === 'PENDING' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => onApprove(card.id)}
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => onReject(card.id)}
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          {card.status !== 'BLOCKED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => onUpdateStatus(card.id, card.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN')}
                            >
                              <Snowflake className="w-3.5 h-3.5" />
                              {card.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
                            </Button>
                          )}

                          {card.status !== 'BLOCKED' && (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => onUpdateStatus(card.id, 'BLOCKED')}
                            >
                              <Lock className="w-3.5 h-3.5" /> Block
                            </Button>
                          )}
                        </>
                      )}
                    </div>
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
            Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalCount} cards)
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
