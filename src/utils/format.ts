export const CURRENCY_SYMBOL = '₱';

type FormatOptions = {
  /** Fixed number of fraction digits. Defaults to 0 for whole numbers, 2 otherwise. */
  decimals?: number;
  /** Prefix positive values with "+" (negatives always get "-"). */
  signed?: boolean;
};

export function formatCurrency(amount: number, { decimals, signed = false }: FormatOptions = {}) {
  const digits = decimals ?? (Number.isInteger(amount) ? 0 : 2);
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  const sign = amount < 0 ? '-' : signed && amount > 0 ? '+' : '';
  return `${sign}${CURRENCY_SYMBOL}${formatted}`;
}

export function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function ratio(part: number, total: number) {
  return total > 0 ? clamp01(part / total) : 0;
}

/** Keeps digits and one decimal point (max 2 fraction digits), grouping thousands as the user types. */
export function formatAmountInput(text: string) {
  const [whole = '', ...rest] = text.replace(/[^\d.]/g, '').split('.');
  const integer = whole.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return rest.length ? `${integer || '0'}.${rest.join('').slice(0, 2)}` : integer;
}

export function parseAmount(text: string) {
  const value = Number(text.replace(/,/g, ''));
  return Number.isFinite(value) ? value : 0;
}
