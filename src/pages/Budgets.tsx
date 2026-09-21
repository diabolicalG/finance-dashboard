import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { calcBudgetSpent } from '../utils/calculations';
import { CategoryIcon } from '../utils/categoryIcons';
import type { BudgetPeriod } from '../types';

export default function Budgets() {
  const { budgets, categories, transactions, addBudget, deleteBudget, formatAmount, currencySymbol } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [period, setPeriod] = useState<BudgetPeriod>('monthly');

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleAdd = () => {
    if (!name.trim() || !amount || !categoryId) return;
    addBudget({ name: name.trim(), amount: parseFloat(amount), category: categoryId, period });
    setName('');
    setAmount('');
    setCategoryId('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Budgets</h2>
          <p className="text-sm text-[var(--text-muted)]">Set spending limits for categories</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Budget
        </button>
      </div>

      {showAdd && (
        <div className="card border-blue-500/50">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">New Budget</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Budget Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder={`Amount (${currencySymbol})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              min="0"
            />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
              <option value="">Select Category</option>
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select value={period} onChange={(e) => setPeriod(e.target.value as BudgetPeriod)} className="input-field">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="btn-primary">Save Budget</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const cat = categories.find((c) => c.id === budget.category);
          const spent = calcBudgetSpent(transactions, budget);
          const remaining = Math.max(0, budget.amount - spent);
          const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
          const isOverBudget = spent > budget.amount;

          return (
            <div key={budget.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: isOverBudget ? 'rgba(239,68,68,0.1)' : `${cat?.color || '#10b981'}1a`,
                      color: isOverBudget ? '#ef4444' : (cat?.color || '#10b981'),
                    }}
                  >
                    <CategoryIcon icon={cat?.icon || ''} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{budget.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] capitalize">{budget.period} • {cat?.name || 'Unknown'}</p>
                  </div>
                </div>
                <button onClick={() => { if (confirm('Delete this budget?')) deleteBudget(budget.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: isOverBudget ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{formatAmount(spent)} spent</span>
                <span className="text-sm text-[var(--text-muted)]">{formatAmount(budget.amount)} limit</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  {formatAmount(remaining)} remaining
                </span>
                {isOverBudget ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <AlertTriangle size={12} /> Over budget
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                    <CheckCircle size={12} /> On track
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-[var(--text-muted)]">No budgets yet. Add your first budget!</p>
        </div>
      )}
    </div>
  );
}
