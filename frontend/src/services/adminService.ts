import { api } from './api';
import {
  AdminDashboardSummary,
  AdminUser,
  AdminCard,
  AdminTransaction,
  AdminAnalytics,
  CardApplicationStatus,
} from '../types/admin.types';
import { CardStatus } from '../types/customer.types';
import { UserRole } from '../types/auth.types';

export const adminService = {
  // Fetch Admin Dashboard Summary KPIs
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    const res = await api.get('/admin/dashboard-summary');
    return res.data.data;
  },

  // Fetch Users List
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole | '';
    isSuspended?: boolean;
  }): Promise<{ users: AdminUser[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    if (params.isSuspended !== undefined) query.append('isSuspended', params.isSuspended.toString());

    const res = await api.get(`/admin/users?${query.toString()}`);
    return res.data.data;
  },

  // Suspend or Activate User
  async updateUserStatus(userId: string, isSuspended: boolean): Promise<AdminUser> {
    const res = await api.patch(`/admin/users/${userId}/status`, { isSuspended });
    return res.data.data;
  },

  // Fetch Cards Portfolio & Applications
  async getCards(params: {
    page?: number;
    limit?: number;
    status?: CardStatus | '';
    applicationStatus?: CardApplicationStatus | '';
  }): Promise<{ cards: AdminCard[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', params.status);
    if (params.applicationStatus) query.append('applicationStatus', params.applicationStatus);

    const res = await api.get(`/admin/cards?${query.toString()}`);
    return res.data.data;
  },

  // Approve Card Application
  async approveCard(cardId: string): Promise<AdminCard> {
    const res = await api.patch(`/admin/cards/${cardId}/approve`);
    return res.data.data;
  },

  // Reject Card Application
  async rejectCard(cardId: string): Promise<AdminCard> {
    const res = await api.patch(`/admin/cards/${cardId}/reject`);
    return res.data.data;
  },

  // Admin Override Card Status (Freeze/Block)
  async updateCardStatus(cardId: string, status: CardStatus): Promise<AdminCard> {
    const res = await api.patch(`/admin/cards/${cardId}/status`, { status });
    return res.data.data;
  },

  // Fetch All System Transactions
  async getAllTransactions(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ transactions: AdminTransaction[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);

    const res = await api.get(`/admin/transactions?${query.toString()}`);
    return res.data.data;
  },

  // Fetch Admin Enterprise Analytics
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const res = await api.get('/admin/analytics');
    return res.data.data;
  },
};
