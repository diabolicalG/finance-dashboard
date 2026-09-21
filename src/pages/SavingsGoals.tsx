import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function SavingsGoals() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, formatAmount, currencySymbol } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');

  const totalTarget = savingsGoals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = savingsGoals.reduce((s, g) => s + g.current, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const handleAdd = () => {
    if (!newName || !newTarget) return;
    addSavingsGoal({
      name: newName,
      target: parseFloat(newTarget),
      current: 0,
      icon: newIcon || 'target',
      color: newColor,
      deadline: '2027-01-01',
    });
    setNewName('');
    setNewTarget('');
    setNewIcon('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">All Savings Goals</h3>
            <p className="text-sm text-[var(--text-muted)]">Total progress across all goals</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Goal
          </button>
        </div>
        <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{formatAmount(totalCurrent)}</span>
          <span className="text-sm text-[var(--text-muted)]">of {formatAmount(totalTarget)}</span>
          <span className="text-sm font-semibold text-blue-500">{overallProgress.toFixed(1)}%</span>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card border-blue-500/50">
          <h4 className="font-bold text-[var(--text-primary)] mb-4">New Savings Goal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder={`Target Amount (${currencySymbol})`}
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="input-field"
              min="0"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="input-field"
            />
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="input-field h-10 cursor-pointer"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="btn-primary">Save Goal</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => {
          const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
          const remaining = goal.target - goal.current;
          return (
            <div key={goal.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{goal.name}</h4>
                    <p className="text-xs text-[var(--text-muted)]">Deadline: {goal.deadline}</p>
                  </div>
                </div>
                <button onClick={() => { if (confirm('Delete this savings goal?')) deleteSavingsGoal(goal.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, backgroundColor: goal.color }}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">{formatAmount(goal.current)} / {formatAmount(goal.target)}</span>
                <span className="text-sm font-semibold" style={{ color: goal.color }}>{progress.toFixed(0)}%</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={`Add ${currencySymbol} funds`}
                  className="input-field flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseFloat((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val > 0) {
                        updateSavingsGoal(goal.id, Math.min(goal.current + val, goal.target));
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    const val = parseFloat(input.value);
                    if (!isNaN(val) && val > 0) {
                      updateSavingsGoal(goal.id, Math.min(goal.current + val, goal.target));
                      input.value = '';
                    }
                  }}
                  className="btn-primary px-4"
                >
                  <TrendingUp size={16} />
                </button>
              </div>

              {progress >= 100 && (
                <div className="mt-3 flex items-center gap-2 text-green-500 text-sm font-medium">
                  <CheckCircle2 size={16} /> Goal Completed!
                </div>
              )}
              {progress < 100 && (
                <p className="mt-2 text-xs text-[var(--text-muted)]">{formatAmount(remaining)} remaining</p>
              )}
            </div>
          );
        })}
      </div>

      {savingsGoals.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-[var(--text-muted)]">No savings goals yet. Add your first goal!</p>
        </div>
      )}
    </div>
  );
}
