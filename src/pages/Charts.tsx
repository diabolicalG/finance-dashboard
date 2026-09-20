import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { formatKSh } from '../utils/currency';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 shadow-lg">
        <p className="text-sm font-semibold">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatKSh(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Charts() {
  const { transactions, categories, savingsGoals } = useFinance();

  const expenseData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    return Object.entries(byCategory).map(([catId, amount]) => {
      const cat = categories.find((c) => c.id === catId);
      return { name: cat?.name || catId, value: amount, color: cat?.color || '#666' };
    });
  }, [transactions, categories]);

  const incomeExpenseMonthly = useMemo(() => {
    const byMonth: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7);
      if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
      byMonth[month][t.type === 'income' ? 'income' : 'expense'] += t.amount;
    });
    return Object.entries(byMonth).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    }));
  }, [transactions]);

  const savingsData = useMemo(() => {
    return savingsGoals.map((g) => ({
      name: g.name,
      current: g.current,
      target: g.target,
      remaining: g.target - g.current,
      color: g.color,
    }));
  }, [savingsGoals]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Expenses by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Income vs Expenses</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeExpenseMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Monthly Net Flow</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpenseMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="net" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Savings Goals Progress</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="current" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="#e2e8f0" radius={[4, 0, 0, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col justify-center">
          <h3 className="font-bold text-[var(--text-primary)] mb-6">Quick Stats</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Total Transactions</span>
              <span className="font-bold text-lg">{transactions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Expense Categories</span>
              <span className="font-bold text-lg">{categories.filter((c) => c.type === 'expense').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Income Categories</span>
              <span className="font-bold text-lg">{categories.filter((c) => c.type === 'income').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Savings Goals</span>
              <span className="font-bold text-lg">{savingsGoals.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Total Saved</span>
              <span className="font-bold text-lg text-green-500">
                {formatKSh(savingsGoals.reduce((s, g) => s + g.current, 0))}
              </span>
            </div>
            <div className="border-t border-[var(--border-color)] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Net Balance</span>
                <span className={`font-bold text-lg ${
                  transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatKSh(transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
