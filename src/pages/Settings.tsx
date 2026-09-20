import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { Download, Upload, Sun, Moon, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, exportData, importData } = useFinance();
  const { darkMode, toggleDarkMode } = useTheme();
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `findash-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!importJson.trim()) return;
    const ok = await importData(importJson);
    setImportStatus(ok ? 'success' : 'error');
    if (ok) setImportJson('');
    setTimeout(() => setImportStatus('idle'), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImportJson(reader.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
        <p className="text-sm text-[var(--text-muted)]">Manage your preferences and data</p>
      </div>

      {/* Appearance */}
      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Appearance</h3>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Dark Mode</p>
              <p className="text-xs text-[var(--text-muted)]">Toggle dark/light theme</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Currency</h3>
        <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
          <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Default Currency</p>
          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value as 'KES' | 'USD' | 'EUR' })}
            className="input-field"
          >
            <option value="KES">KES - Kenyan Shilling</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>
      </div>

      {/* Data Export */}
      <div className="card">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">Data Backup</h3>
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={18} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Export Data</p>
                  <p className="text-xs text-[var(--text-muted)]">Download all your data as JSON</p>
                </div>
              </div>
              <button onClick={handleExport} className="btn-primary">Export</button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-3 mb-3">
              <Upload size={18} className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Import Data</p>
                <p className="text-xs text-[var(--text-muted)]">Restore from a backup JSON file</p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="input-field mb-2"
            />
            {importJson && (
              <div className="flex gap-3 mt-2">
                <button onClick={handleImport} className="btn-primary">Import</button>
                <button onClick={() => setImportJson('')} className="btn-secondary">Cancel</button>
              </div>
            )}
            {importStatus === 'success' && (
              <p className="text-sm text-green-500 mt-2">Data imported successfully!</p>
            )}
            {importStatus === 'error' && (
              <p className="text-sm text-red-500 mt-2">Import failed. Invalid JSON data.</p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/30">
        <h3 className="font-bold text-red-500 mb-2 flex items-center gap-2">
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">Reset all data and start fresh</p>
        {showConfirm ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.clear();
                indexedDB.deleteDatabase('findash-finance');
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Confirm Reset
            </button>
            <button onClick={() => setShowConfirm(false)} className="btn-secondary">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowConfirm(true)} className="px-4 py-2 border border-red-500 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-colors">
            Reset All Data
          </button>
        )}
      </div>
    </div>
  );
}
