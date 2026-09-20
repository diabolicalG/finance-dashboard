import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, Search, Plus, X, Save } from 'lucide-react';
import { formatKSh } from '../utils/currency';

export default function Expenses() {
  const { transactions, categories, deleteTransaction, addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const expenses = transactions.filter((t) => t.type === 'expense');

  const filtered = expenses.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const expenseByCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleAdd = () => {
    if (!desc.trim() || !amount || !categoryId) return;
    addTransaction({
      description: desc.trim(),
      amount: parseFloat(amount),
      type: 'expense',
      category: categoryId,
      date,
    });
    setDesc('');
    setAmount('');
    setCategoryId('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Expenses</h2>
          <p className="text-sm text-[var(--text-muted)]">Track and manage your spending</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card border-blue-500/50">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">New Expense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Amount (KSh)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              min="0"
              step="0.01"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
            >
              <option value="">Select Category</option>
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Save size={16} /> Save Expense
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-[var(--text-muted)]">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{formatKSh(totalExpenses)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--text-muted)]">Transactions</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{expenses.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--text-muted)]">Average</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{formatKSh(avgExpense)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Expense by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(expenseByCategory).map(([catId, amt]) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <div key={catId} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-2">
                  {cat && (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  )}
                  <span className="text-sm font-medium">{cat?.name || catId}</span>
                </div>
                <span className="text-sm font-semibold">{formatKSh(amt)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense List */}
      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Description</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Category</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Amount</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => {
                const cat = categories.find((c) => c.id === txn.category);
                return (
                  <tr key={txn.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{txn.description}</td>
                    <td className="py-3 px-4 text-sm text-[var(--text-muted)]">{txn.date}</td>
                    <td className="py-3 px-4">
                      <span className="badge" style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}>
                        {cat?.name || txn.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-right text-red-500">-{formatKSh(txn.amount)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteTransaction(txn.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-[var(--text-muted)]">No expenses found</p>
          )}
        </div>
      </div>
    </div>
  );
}
