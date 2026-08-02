import React, { useState } from 'react';
import {
  useAdminCardsQuery,
  useApproveCardMutation,
  useRejectCardMutation,
  useAdminUpdateCardStatusMutation,
} from '../../hooks/useAdminData';
import { AdminCardsTable } from '../../components/admin/AdminCardsTable';
import { CardStatus } from '../../types/customer.types';
import { CardApplicationStatus } from '../../types/admin.types';

export const AdminCardsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<CardStatus | ''>('');
  const [appStatus, setAppStatus] = useState<CardApplicationStatus | ''>('');

  const { data, isLoading } = useAdminCardsQuery({
    page,
    limit: 10,
    status,
    applicationStatus: appStatus,
  });

  const approveMutation = useApproveCardMutation();
  const rejectMutation = useRejectCardMutation();
  const updateCardStatusMutation = useAdminUpdateCardStatusMutation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Credit Card Approvals & Controls</h1>
        <p className="text-sm text-slate-400">Review pending card applications, approve or reject applications, and override card status.</p>
      </div>

      <AdminCardsTable
        cards={data?.cards || []}
        pagination={data?.pagination}
        selectedStatus={status}
        onStatusChange={(s) => { setStatus(s as CardStatus); setPage(1); }}
        selectedAppStatus={appStatus}
        onAppStatusChange={(a) => { setAppStatus(a as CardApplicationStatus); setPage(1); }}
        onPageChange={(p) => setPage(p)}
        onApprove={(id) => approveMutation.mutate(id)}
        onReject={(id) => rejectMutation.mutate(id)}
        onUpdateStatus={(cardId, status) => updateCardStatusMutation.mutate({ cardId, status })}
        isProcessing={approveMutation.isPending || rejectMutation.isPending || updateCardStatusMutation.isPending}
        isLoading={isLoading}
      />
    </div>
  );
};
