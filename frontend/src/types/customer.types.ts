export type CardStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED';
export type CardType = 'PLATINUM' | 'GOLD' | 'TITANIUM' | 'BLACK_EDITION';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';
export type TransactionCategory =
  | 'SHOPPING'
  | 'DINING'
  | 'TRAVEL'
  | 'ENTERTAINMENT'
  | 'UTILITIES'
  | 'GROCERIES'
  | 'HEALTH'
  | 'OTHER';

export interface Card {
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
  createdAt: string;
}

export interface Transaction {
  id: string;
  cardId: string;
  userId: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  status: TransactionStatus;
  description?: string;
  date: string;
  card?: {
    cardNumber: string;
    cardType: CardType;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Reward {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  pointsRequired: number;
  status: 'AVAILABLE' | 'REDEEMED' | 'EXPIRED';
  redeemedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  summary: {
    totalCreditLimit: number;
    totalAvailableCredit: number;
    totalOutstandingBalance: number;
    rewardPoints: number;
    totalCardsCount: number;
  };
  cards: Card[];
  recentTransactions: Transaction[];
  unreadNotifications: Notification[];
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: Pagination;
}

export interface SpendingAnalytics {
  categorySpending: Array<{ category: string; amount: number }>;
  monthlySpending: Array<{ month: string; amount: number }>;
  totalSpent: number;
}

export interface Statement {
  month: string;
  year: number;
  totalSpent: number;
  transactionsCount: number;
  cardLast4: string;
  dueDate: string;
  status: string;
}
