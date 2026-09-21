import { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { useFinance } from './context/FinanceContext';
import {
  LayoutDashboard,
  Receipt,
  Target,
  List,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  DollarSign,
  PiggyBank,
  Settings,
  Tags,
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import SavingsGoals from './pages/SavingsGoals';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Charts from './pages/Charts';
import Budgets from './pages/Budgets';
import SettingsPage from './pages/Settings';

type Page = 'dashboard' | 'expenses' | 'savings' | 'transactions' | 'categories' | 'charts' | 'budgets' | 'settings';

const navItems: { key: Page; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'transactions', label: 'Transactions', icon: List },
  { key: 'expenses', label: 'Expenses', icon: Receipt },
  { key: 'budgets', label: 'Budgets', icon: PiggyBank },
  { key: 'savings', label: 'Savings', icon: Target },
  { key: 'categories', label: 'Categories', icon: Tags },
  { key: 'charts', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { loading } = useFinance();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSetPage = (page: string) => {
    const validPages: string[] = navItems.map((n) => n.key);
    if (validPages.includes(page)) {
      setActivePage(page as Page);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard setPage={handleSetPage} />;
      case 'expenses': return <Expenses />;
      case 'savings': return <SavingsGoals />;
      case 'transactions': return <Transactions />;
      case 'categories': return <Categories />;
      case 'charts': return <Charts />;
      case 'budgets': return <Budgets />;
      case 'settings': return <SettingsPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[var(--sidebar-bg)] text-white fixed left-0 top-0 z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg">FinDash</h1>
            <p className="text-xs text-slate-400">Finance Manager</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 w-72 min-h-full bg-[var(--sidebar-bg)] text-white p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <DollarSign size={22} />
                </div>
                <h1 className="font-bold text-lg">FinDash</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActivePage(item.key); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <button onClick={toggleDarkMode} className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-card)]" onClick={() => setSidebarOpen(true)}>
                <Menu size={22} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {navItems.find((i) => i.key === activePage)?.label}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleDarkMode} className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-colors">
                {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-500" />}
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            renderPage()
          )}
        </div>
      </main>
    </div>
  );
}
