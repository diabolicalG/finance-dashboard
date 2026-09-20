export type TransactionType = 'income' | 'expense';
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  createdAt: number;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  category: string;
  period: BudgetPeriod;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  deadline: string;
}

export interface AppSettings {
  darkMode: boolean;
  currency: 'KES' | 'USD' | 'EUR';
  monthlyBudget: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  settings?: AppSettings;
}
