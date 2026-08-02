import { CardStatus, CardType, TransactionCategory, TransactionStatus } from './customer.types';
import { UserRole } from './auth.types';

export type CardApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isSuspended: boolean;
  createdAt: string;
  _count?: {
    cards: number;
    transactions: number;
  };
}

export interface AdminCard {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  cardType: CardType;
  expiryDate: string;
  cvv: string;
  creditLimit: number;
  availableCredit: number;
  outstandingBalance: number;
  status: CardStatus;
  applicationStatus: CardApplicationStatus;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface AdminTransaction {
  id: string;
  cardId: string;
  userId: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  status: TransactionStatus;
  date: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  card?: {
    cardNumber: string;
    cardType: CardType;
  };
}

export interface AdminDashboardSummary {
  summary: {
    totalUsers: number;
    activeCards: number;
    blockedCards: number;
    monthlyTransactionsVolume: number;
    monthlyTransactionsCount: number;
    pendingApplicationsCount: number;
  };
  recentPendingCards: AdminCard[];
}

export interface AdminAnalytics {
  cardTypeDistribution: Array<{ type: string; count: number }>;
  spendingTrends: Array<{ month: string; volume: number }>;
  userAcquisition: Array<{ month: string; newUsers: number }>;
}
