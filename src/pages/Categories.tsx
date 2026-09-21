import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2 } from 'lucide-react';
import type { TransactionType } from '../types';
import { CategoryIcon, iconOptions } from '../utils/categoryIcons';

export default function Categories() {
  const { categories, addCategory, deleteCategory } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState('utensils');
  const [color, setColor] = useState('#3b82f6');

  const handleAdd = () => {
    if (!name.trim()) return;
    addCategory({ name: name.trim(), icon, color, type });
    setName('');
    setIcon('utensils');
    setColor('#3b82f6');
    setShowAdd(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    const ok = deleteCategory(id);
    if (!ok) alert(`"${catName}" is still used by existing transactions or budgets. Reassign or remove those first.`);
  };

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-[var(--text-muted)]">Total Categories</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{categories.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-[var(--text-muted)]">Expense</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{expenseCats.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-[var(--text-muted)]">Income</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{incomeCats.length}</p>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card border-blue-500/50">
          <h4 className="font-bold text-[var(--text-primary)] mb-4">Add Category</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="input-field"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="input-field"
            >
              {iconOptions.map((i) => (
                <option key={i} value={i}>{i.replace('-', ' ')}</option>
              ))}
            </select>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input-field h-10 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-[var(--bg-secondary)]">
            <span className="text-xs text-[var(--text-muted)]">Preview:</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
              <CategoryIcon icon={icon} size={18} />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{name || 'Category name'}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="btn-primary">Add Category</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 12l4-4"/></svg> Expense Categories
          </h3>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {expenseCats.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                  <CategoryIcon icon={cat.icon} size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{cat.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">Expense</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Income */}
      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Income Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {incomeCats.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                  <CategoryIcon icon={cat.icon} size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{cat.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">Income</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
