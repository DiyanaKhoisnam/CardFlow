import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { CardStatus } from '../types/customer.types';
import { UserRole } from '../types/auth.types';
import { CardApplicationStatus } from '../types/admin.types';

export const ADMIN_QUERY_KEYS = {
  summary: ['admin', 'summary'],
  users: (params: any) => ['admin', 'users', params],
  cards: (params: any) => ['admin', 'cards', params],
  transactions: (params: any) => ['admin', 'transactions', params],
  analytics: ['admin', 'analytics'],
};

// 1. Admin Summary Query
export const useAdminDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.summary,
    queryFn: () => adminService.getDashboardSummary(),
  });
};

// 2. Admin Users Query
export const useAdminUsersQuery = (params: { page?: number; limit?: number; search?: string; role?: UserRole | ''; isSuspended?: boolean }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users(params),
    queryFn: () => adminService.getUsers(params),
  });
};

// 3. Suspend/Activate User Mutation
export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isSuspended }: { userId: string; isSuspended: boolean }) =>
      adminService.updateUserStatus(userId, isSuspended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.summary });
    },
  });
};

// 4. Admin Cards Query
export const useAdminCardsQuery = (params: { page?: number; limit?: number; status?: CardStatus | ''; applicationStatus?: CardApplicationStatus | '' }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.cards(params),
    queryFn: () => adminService.getCards(params),
  });
};

// 5. Approve Card Mutation
export const useApproveCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => adminService.approveCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.summary });
    },
  });
};

// 6. Reject Card Mutation
export const useRejectCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => adminService.rejectCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.summary });
    },
  });
};

// 7. Admin Update Card Status Override Mutation
export const useAdminUpdateCardStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, status }: { cardId: string; status: CardStatus }) =>
      adminService.updateCardStatus(cardId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.summary });
    },
  });
};

// 8. System-Wide Transactions Query
export const useAdminTransactionsQuery = (params: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.transactions(params),
    queryFn: () => adminService.getAllTransactions(params),
  });
};

// 9. Admin Analytics Query
export const useAdminAnalyticsQuery = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.analytics,
    queryFn: () => adminService.getAdminAnalytics(),
  });
};
