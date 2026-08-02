import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { CardStatus, TransactionCategory, TransactionStatus } from '../types/customer.types';

export const CUSTOMER_QUERY_KEYS = {
  summary: ['customer', 'summary'],
  cards: ['customer', 'cards'],
  transactions: (params: any) => ['customer', 'transactions', params],
  analytics: ['customer', 'analytics'],
  rewards: ['customer', 'rewards'],
  statements: ['customer', 'statements'],
};

// 1. Dashboard Summary Query
export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.summary,
    queryFn: () => customerService.getDashboardSummary(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

// 2. User Cards Query
export const useUserCardsQuery = () => {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.cards,
    queryFn: () => customerService.getUserCards(),
  });
};

// 3. Update Card Status Mutation (Freeze/Unfreeze/Block)
export const useUpdateCardStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, status }: { cardId: string; status: CardStatus }) =>
      customerService.updateCardStatus(cardId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.cards });
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.summary });
    },
  });
};

// 4. Paginated & Filtered Transactions Query
export const useTransactionsQuery = (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: TransactionCategory | '';
  status?: TransactionStatus | '';
}) => {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.transactions(params),
    queryFn: () => customerService.getTransactions(params),
  });
};

// 5. Spending Analytics Query
export const useAnalyticsQuery = () => {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.analytics,
    queryFn: () => customerService.getSpendingAnalytics(),
  });
};

// 6. Rewards Query
export const useRewardsQuery = () => {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.rewards,
    queryFn: () => customerService.getRewards(),
  });
};

// 7. Redeem Reward Mutation
export const useRedeemRewardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rewardId: string) => customerService.redeemReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.rewards });
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.summary });
    },
  });
};

// 8. Monthly Statements Query
export const useStatementsQuery = () => {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.statements,
    queryFn: () => customerService.getStatements(),
  });
};
