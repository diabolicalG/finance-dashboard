import type { FinanceData, AppSettings } from '../types';

const DB_NAME = 'findash-finance';
const DB_VERSION = 1;
const STORE_NAME = 'data';
const SETTINGS_KEY = 'settings';
const DATA_KEY = 'financeData';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to open IndexedDB'));
  });
}

export async function loadFinanceData(): Promise<FinanceData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DATA_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(new Error('Failed to read data'));
    });
  } catch {
    return null;
  }
}

export async function saveFinanceData(data: FinanceData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(data, DATA_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(new Error('Failed to save data'));
  });
}

export async function loadSettings(): Promise<AppSettings | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(SETTINGS_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(new Error('Failed to read settings'));
    });
  } catch {
    return null;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(settings, SETTINGS_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(new Error('Failed to save settings'));
  });
}

export async function exportAllData(): Promise<string> {
  const data = await loadFinanceData();
  const settings = await loadSettings();
  return JSON.stringify({ financeData: data, settings }, null, 2);
}

export async function importAllData(json: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(json);
    if (parsed.financeData) {
      await saveFinanceData(parsed.financeData);
    }
    if (parsed.settings) {
      await saveSettings(parsed.settings);
    }
    return true;
  } catch {
    return false;
  }
}
