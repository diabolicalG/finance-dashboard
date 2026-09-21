import { useFinance } from '../context/FinanceContext';
import {
  TrendingDown,
  TrendingUp,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { CategoryIcon } from '../utils/categoryIcons';

export default function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const { transactions, savingsGoals, categories, formatAmount } = useFinance();

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
    .slice(0, 5)
    .map(([catId, amount]) => ({ category: categories.find((c) => c.id === catId), catId, amount }));

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
            <p className={valueClass}>{formatAmount(totalIncome)}</p>
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
            <p className={valueClass}>{formatAmount(totalExpenses)}</p>
          </div>
        </div>

        <div
          className="card flex flex-col gap-2 text-white border-0 relative overflow-hidden"
          style={{
            background: balance >= 0
              ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
              : 'linear-gradient(135deg, #dc2626, #b91c1c)',
            boxShadow: balance >= 0 ? '0 10px 25px -5px rgba(37,99,235,0.4)' : '0 10px 25px -5px rgba(220,38,38,0.4)',
          }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="flex items-center justify-between relative">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="relative">
            <p className="text-sm text-white/80">Balance</p>
            <p className="text-2xl font-bold">{formatAmount(balance)}</p>
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
            <p className={valueClass}>{formatAmount(totalSavings)}</p>
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
              const cat = categories.find((c) => c.id === txn.category);
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
                      <p className="text-xs text-[var(--text-muted)]">{cat?.name || 'Uncategorized'} · {txn.date}</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
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
            {topCategories.map(({ category, catId, amount }) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              const color = category?.color || '#3b82f6';
              return (
                <div key={catId}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
                        <CategoryIcon icon={category?.icon || ''} size={13} />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{category?.name || 'Uncategorized'}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{formatAmount(amount)}</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
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
                    <span className="text-xs text-[var(--text-muted)]">{formatAmount(goal.current)} saved</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: goal.color }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Target: {formatAmount(goal.target)} by {goal.deadline}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
