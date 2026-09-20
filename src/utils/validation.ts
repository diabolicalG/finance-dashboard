import type { Transaction, Category, Budget, SavingsGoal } from '../types';

export function validateTransaction(t: Partial<Transaction>): string[] {
  const errors: string[] = [];
  if (!t.description?.trim()) errors.push('Description is required');
  if (t.amount === undefined || t.amount <= 0) errors.push('Amount must be greater than 0');
  if (!t.type || !['income', 'expense'].includes(t.type)) errors.push('Type must be income or expense');
  if (!t.category?.trim()) errors.push('Category is required');
  if (!t.date?.trim()) errors.push('Date is required');
  return errors;
}

export function validateCategory(c: Partial<Category>): string[] {
  const errors: string[] = [];
  if (!c.name?.trim()) errors.push('Name is required');
  if (!c.icon?.trim()) errors.push('Icon is required');
  if (!c.color?.trim()) errors.push('Color is required');
  if (!c.type || !['income', 'expense'].includes(c.type)) errors.push('Type must be income or expense');
  return errors;
}

export function validateBudget(b: Partial<Budget>): string[] {
  const errors: string[] = [];
  if (!b.name?.trim()) errors.push('Name is required');
  if (b.amount === undefined || b.amount <= 0) errors.push('Amount must be greater than 0');
  if (!b.category?.trim()) errors.push('Category is required');
  if (!b.period || !['weekly', 'monthly', 'yearly'].includes(b.period)) errors.push('Period is required');
  return errors;
}

export function validateSavingsGoal(g: Partial<SavingsGoal>): string[] {
  const errors: string[] = [];
  if (!g.name?.trim()) errors.push('Name is required');
  if (g.target === undefined || g.target <= 0) errors.push('Target must be greater than 0');
  if (g.current === undefined || g.current < 0) errors.push('Current cannot be negative');
  if (!g.deadline?.trim()) errors.push('Deadline is required');
  return errors;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
