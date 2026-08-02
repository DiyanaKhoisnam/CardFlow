import { api } from './api';
import {
  DashboardSummary,
  Card,
  CardStatus,
  PaginatedTransactions,
  SpendingAnalytics,
  Reward,
  Statement,
  TransactionCategory,
  TransactionStatus,
} from '../types/customer.types';

export const customerService = {
  // Fetch Summary Cards & Dashboard Data
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await api.get('/customer/dashboard-summary');
    return res.data.data;
  },

  // Fetch User Cards
  async getUserCards(): Promise<Card[]> {
    const res = await api.get('/cards');
    return res.data.data;
  },

  // Update Card Status (Freeze, Unfreeze, Block)
  async updateCardStatus(cardId: string, status: CardStatus): Promise<Card> {
    const res = await api.patch(`/cards/${cardId}/status`, { status });
    return res.data.data;
  },

  // Fetch Transactions with search, filters, pagination
  async getTransactions(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: TransactionCategory | '';
    status?: TransactionStatus | '';
  }): Promise<PaginatedTransactions> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.status) query.append('status', params.status);

    const res = await api.get(`/transactions?${query.toString()}`);
    return res.data.data;
  },

  // Fetch Spending Analytics
  async getSpendingAnalytics(): Promise<SpendingAnalytics> {
    const res = await api.get('/transactions/analytics');
    return res.data.data;
  },

  // Fetch Rewards Catalog & Points Summary
  async getRewards(): Promise<{ rewards: Reward[]; summary: { totalEarnedPoints: number; redeemedPoints: number; availablePoints: number } }> {
    const res = await api.get('/rewards');
    return res.data.data;
  },

  // Redeem Reward Item
  async redeemReward(rewardId: string): Promise<Reward> {
    const res = await api.post(`/rewards/${rewardId}/redeem`);
    return res.data.data;
  },

  // Fetch Monthly Statements
  async getStatements(): Promise<Statement[]> {
    const res = await api.get('/customer/statements');
    return res.data.data;
  },
};
