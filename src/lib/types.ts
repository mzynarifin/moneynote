export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  transactionDate: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type FilterType = "all" | "income" | "expense";

export interface DashboardSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  weeklyExpense: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentTransactions: Transaction[];
  weeklyExpenses: { date: string; total: number }[];
  hasTransactions: boolean;
}

export interface TransactionListResponse {
  data: Transaction[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionFilters {
  type: FilterType;
  search: string;
  startDate: string;
  endDate: string;
  page: number;
}