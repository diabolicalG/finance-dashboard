import type { Transaction, Budget, SavingsGoal, MonthlyData } from '../types';

export function calcTotalIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
}

export function calcTotalExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

export function calcBalance(transactions: Transaction[]): number {
  return calcTotalIncome(transactions) - calcTotalExpenses(transactions);
}

export function calcExpensesByCategory(transactions: Transaction[]): Record<string, number> {
  const result: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      result[t.category] = (result[t.category] || 0) + t.amount;
    });
  return result;
}

export function calcIncomeByCategory(transactions: Transaction[]): Record<string, number> {
  const result: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'income')
    .forEach((t) => {
      result[t.category] = (result[t.category] || 0) + t.amount;
    });
  return result;
}

export function calcMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const byMonth: Record<string, MonthlyData> = {};
  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!byMonth[month]) byMonth[month] = { month, income: 0, expense: 0 };
    if (t.type === 'income') {
      byMonth[month].income += t.amount;
    } else {
      byMonth[month].expense += t.amount;
    }
  });
  return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
}

export function calcAverageMonthlyIncome(transactions: Transaction[]): number {
  const months = calcMonthlyData(transactions);
  if (months.length === 0) return 0;
  const total = months.reduce((sum, m) => sum + m.income, 0);
  return total / months.length;
}

export function calcAverageMonthlyExpense(transactions: Transaction[]): number {
  const months = calcMonthlyData(transactions);
  if (months.length === 0) return 0;
  const total = months.reduce((sum, m) => sum + m.expense, 0);
  return total / months.length;
}

export function calcBudgetSpent(transactions: Transaction[], budget: Budget): number {
  const now = new Date();
  return transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      if (t.category !== budget.category) return false;
      const d = new Date(t.date);
      if (budget.period === 'weekly') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      if (budget.period === 'monthly') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (budget.period === 'yearly') {
        return d.getFullYear() === now.getFullYear();
      }
      return false;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calcSavingsGoalProgress(goal: SavingsGoal): number {
  if (goal.target <= 0) return 0;
  return Math.min((goal.current / goal.target) * 100, 100);
}

export function calcTotalSavings(savingsGoals: SavingsGoal[]): number {
  return savingsGoals.reduce((sum, g) => sum + g.current, 0);
}

export function calcTotalSavingsTarget(savingsGoals: SavingsGoal[]): number {
  return savingsGoals.reduce((sum, g) => sum + g.target, 0);
}
