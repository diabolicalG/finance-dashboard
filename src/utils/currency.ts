import type { CurrencyCode } from '../types';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; locale: string }> = {
  KES: { symbol: 'KSh', locale: 'en-KE' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'KES',
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {};
  const { symbol, locale } = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KES;
  return `${symbol} ${amount.toLocaleString(locale, { minimumFractionDigits, maximumFractionDigits })}`;
}

export function formatCurrencyShort(amount: number, currency: CurrencyCode = 'KES'): string {
  const { symbol } = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KES;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}${symbol} ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${symbol} ${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${symbol} ${abs.toFixed(0)}`;
}

export function getCurrencySymbol(currency: CurrencyCode = 'KES'): string {
  return (CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KES).symbol;
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Legacy aliases kept for compatibility with any external references.
export const formatKSh = (amount: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) =>
  formatCurrency(amount, 'KES', options);
