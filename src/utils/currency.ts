export function formatKSh(amount: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {};
  return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits, maximumFractionDigits })}`;
}

export function formatKShShort(amount: number): string {
  if (amount >= 1_000_000) return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KSh ${(amount / 1_000).toFixed(1)}K`;
  return `KSh ${amount.toFixed(0)}`;
}

export function parseKShInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
