import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Transaction, Category, Budget, SavingsGoal, AppSettings } from '../types';
import { loadFinanceData, saveFinanceData, loadSettings, saveSettings, exportAllData, importAllData } from '../db/database';
import { seedDefaultCategories } from '../utils/seedCategories';
import { generateId } from '../utils/validation';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  settings: AppSettings;
  loading: boolean;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (data: Omit<Category, 'id'>) => void;
  /** Returns false (and leaves the category untouched) if it's still referenced by a transaction or budget. */
  deleteCategory: (id: string) => boolean;
  addBudget: (data: Omit<Budget, 'id' | 'createdAt'>) => void;
  deleteBudget: (id: string) => void;
  addSavingsGoal: (data: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, current: number) => void;
  deleteSavingsGoal: (id: string) => void;
  updateSettings: (data: Partial<AppSettings>) => void;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<boolean>;
  formatAmount: (amount: number) => string;
  currencySymbol: string;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const defaultSettings: AppSettings = {
  currency: 'KES',
  monthlyBudget: 0,
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((data: { transactions: Transaction[]; categories: Category[]; budgets: Budget[]; savingsGoals: SavingsGoal[] }) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveFinanceData(data).catch(console.error);
    }, 300);
  }, []);

  const persistSettings = useCallback((s: AppSettings) => {
    saveSettings(s).catch(console.error);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await loadFinanceData();
        const savedSettings = await loadSettings();
        if (!mounted) return;

        if (data) {
          setTransactions(data.transactions || []);
          setCategories(data.categories || []);
          setBudgets(data.budgets || []);
          setSavingsGoals(data.savingsGoals || []);
        } else {
          const seeded = seedDefaultCategories();
          setCategories(seeded);
          saveFinanceData({ transactions: [], categories: seeded, budgets: [], savingsGoals: [] }).catch(console.error);
        }
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (err) {
        console.error('Failed to init:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loading) {
      persist({ transactions, categories, budgets, savingsGoals });
    }
  }, [transactions, categories, budgets, savingsGoals, loading, persist]);

  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const txn: Transaction = { ...data, id: generateId('txn'), createdAt: Date.now() };
    setTransactions((prev) => [txn, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addCategory = useCallback((data: Omit<Category, 'id'>) => {
    const cat: Category = { ...data, id: generateId('cat') };
    setCategories((prev) => [...prev, cat]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const inUse = transactions.some((t) => t.category === id) || budgets.some((b) => b.category === id);
    if (inUse) return false;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  }, [transactions, budgets]);

  const addBudget = useCallback((data: Omit<Budget, 'id' | 'createdAt'>) => {
    const b: Budget = { ...data, id: generateId('budget'), createdAt: Date.now() };
    setBudgets((prev) => [...prev, b]);
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addSavingsGoal = useCallback((data: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = { ...data, id: generateId('goal') };
    setSavingsGoals((prev) => [...prev, goal]);
  }, []);

  const updateSavingsGoal = useCallback((id: string, current: number) => {
    setSavingsGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current: Math.min(current, g.target) } : g)));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateSettings = useCallback((data: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...data };
      persistSettings(next);
      return next;
    });
  }, [persistSettings]);

  const formatAmount = useCallback((amount: number) => formatCurrency(amount, settings.currency), [settings.currency]);

  const exportData = useCallback(async () => exportAllData(), []);
  const importData = useCallback(async (json: string) => {
    const ok = await importAllData(json);
    if (ok) {
      const data = await loadFinanceData();
      const savedSettings = await loadSettings();
      if (data) {
        setTransactions(data.transactions || []);
        setCategories(data.categories || []);
        setBudgets(data.budgets || []);
        setSavingsGoals(data.savingsGoals || []);
      }
      if (savedSettings) setSettings(savedSettings);
    }
    return ok;
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        savingsGoals,
        settings,
        loading,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        addBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        updateSettings,
        exportData,
        importData,
        formatAmount,
        currencySymbol: getCurrencySymbol(settings.currency),
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
