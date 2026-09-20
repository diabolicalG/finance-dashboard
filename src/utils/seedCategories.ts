import type { Category } from '../types';
import { generateId } from './validation';

const defaultExpenseCategories: Omit<Category, 'id'>[] = [
  { name: 'Food & Dining', icon: '🍽️', color: '#ef4444', type: 'expense' },
  { name: 'Transport', icon: '🚌', color: '#3b82f6', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#8b5cf6', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899', type: 'expense' },
  { name: 'Utilities', icon: '⚡', color: '#f59e0b', type: 'expense' },
  { name: 'Healthcare', icon: '💊', color: '#10b981', type: 'expense' },
  { name: 'Rent', icon: '🏠', color: '#6366f1', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#14b8a6', type: 'expense' },
  { name: 'Personal Care', icon: '💇', color: '#f472b6', type: 'expense' },
  { name: 'Gifts & Donations', icon: '🎁', color: '#a855f7', type: 'expense' },
];

const defaultIncomeCategories: Omit<Category, 'id'>[] = [
  { name: 'Salary', icon: '💰', color: '#3b82f6', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#8b5cf6', type: 'income' },
  { name: 'Investments', icon: '📈', color: '#10b981', type: 'income' },
  { name: 'Business', icon: '🏢', color: '#6366f1', type: 'income' },
  { name: 'Side Hustle', icon: '🚀', color: '#f59e0b', type: 'income' },
];

export function seedDefaultCategories(): Category[] {
  const cats: Category[] = [];
  defaultExpenseCategories.forEach((c) => {
    cats.push({ ...c, id: generateId('cat') });
  });
  defaultIncomeCategories.forEach((c) => {
    cats.push({ ...c, id: generateId('cat') });
  });
  return cats;
}
