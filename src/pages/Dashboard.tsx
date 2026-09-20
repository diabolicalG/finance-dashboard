import { useFinance } from '../context/FinanceContext';
import {
  TrendingDown,
  TrendingUp,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from 'lucide-react';
import { formatKSh } from '../utils/currency';

export default function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const { transactions, savingsGoals } = useFinance();

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.current, 0);

  const expenseCategories = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(expenseCategories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);

  const cardClass = `card flex flex-col gap-2`;
  const valueClass = `text-2xl font-bold text-[var(--text-primary)]`;
  const labelClass = `text-sm text-[var(--text-muted)]`;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
          </div>
          <div>
            <p className={labelClass}>Total Income</p>
            <p className={valueClass}>{formatKSh(totalIncome)}</p>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-500" />
            </div>
          </div>
          <div>
            <p className={labelClass}>Total Expenses</p>
            <p className={valueClass}>{formatKSh(totalExpenses)}</p>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-500" />
            </div>
          </div>
          <div>
            <p className={labelClass}>Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatKSh(balance)}</p>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <PiggyBank size={20} className="text-purple-500" />
            </div>
          </div>
          <div>
            <p className={labelClass}>Savings</p>
            <p className={valueClass}>{formatKSh(totalSavings)}</p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Transactions</h3>
            <button onClick={() => setPage('transactions')} className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((txn) => {
              return (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: txn.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}
                    >
                      {txn.type === 'income' ? (
                        <ArrowUpRight size={18} className="text-green-500" />
                      ) : (
                        <ArrowDownRight size={18} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{txn.description}</p>
                      <p className="text-xs text-[var(--text-muted)]">{txn.date}</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {txn.type === 'income' ? '+' : '-'}{formatKSh(txn.amount)}
                  </p>
                </div>
              );
            })}
            {recentTransactions.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Top Expenses */}
        <div className="card">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Top Categories</h3>
          <div className="space-y-4">
            {topCategories.map(([catId, amount]) => {
              const percentage = totalExpenses > 0 ? ((amount as number) / totalExpenses) * 100 : 0;
              return (
                <div key={catId}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Receipt size={16} className="text-[var(--text-muted)]" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{catId}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{formatKSh(amount as number)}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topCategories.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">No expenses yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Savings Goals Progress */}
      {savingsGoals.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Savings Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {savingsGoals.map((goal) => {
              const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
              return (
                <div key={goal.id} className="p-4 rounded-xl border border-[var(--border-color)] hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${goal.color}20` }}>
                        <span className="text-lg">{goal.icon}</span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{goal.name}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs text-[var(--text-muted)]">{formatKSh(goal.current)} saved</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: goal.color }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Target: {formatKSh(goal.target)} by {goal.deadline}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
