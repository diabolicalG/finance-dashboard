import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, ArrowUp, ArrowDown, Plus, X, Save } from 'lucide-react';
import type { TransactionType } from '../types';

export default function Transactions() {
  const { transactions, categories, deleteTransaction, addTransaction, formatAmount, currencySymbol } = useFinance();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filtered = transactions
    .filter((t) => filter === 'all' || t.type === filter)
    .sort((a, b) => {
      if (sortField === 'amount') return sortAsc ? a.amount - b.amount : b.amount - a.amount;
      return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });

  const incomeTotal = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseTotal = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleAdd = () => {
    if (!desc.trim() || !amount || !categoryId) return;
    addTransaction({
      description: desc.trim(),
      amount: parseFloat(amount),
      type,
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
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Transactions</h2>
          <p className="text-sm text-[var(--text-muted)]">View and manage all transactions</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card border-blue-500/50">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">New Transaction</h3>
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
              placeholder={`Amount (${currencySymbol})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              min="0"
              step="0.01"
            />
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as TransactionType);
                setCategoryId('');
              }}
              className="input-field"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
            >
              <option value="">Select Category</option>
              {(type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
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
              <Save size={16} /> Save Transaction
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-[var(--text-muted)]">All Transactions</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{transactions.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--text-muted)]">Income</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{formatAmount(incomeTotal)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--text-muted)]">Expenses</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{formatAmount(expenseTotal)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              if (sortField === 'date') setSortAsc((prev) => !prev);
              else { setSortField('date'); setSortAsc(false); }
            }}
            className={`btn-secondary flex items-center gap-2 ${sortField === 'date' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : ''}`}
          >
            {sortField === 'date' && sortAsc ? <ArrowUp size={14} /> : <ArrowDown size={14} />} Date
          </button>
          <button
            onClick={() => {
              if (sortField === 'amount') setSortAsc((prev) => !prev);
              else { setSortField('amount'); setSortAsc(false); }
            }}
            className={`btn-secondary flex items-center gap-2 ${sortField === 'amount' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : ''}`}
          >
            {sortField === 'amount' && sortAsc ? <ArrowUp size={14} /> : <ArrowDown size={14} />} Amount
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Description</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Date</th>
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
                    <td className="py-3 px-4">
                      <span className={`badge ${txn.type === 'income' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {cat ? (
                        <span className="badge" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                          {cat.name}
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--text-muted)]">{txn.category}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--text-muted)]">{txn.date}</td>
                    <td className={`py-3 px-4 text-sm font-semibold text-right ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => { if (confirm('Delete this transaction?')) deleteTransaction(txn.id); }}
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
            <p className="text-center py-8 text-[var(--text-muted)]">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
}
