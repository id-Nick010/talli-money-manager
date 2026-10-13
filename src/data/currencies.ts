export type Currency = { code: string; name: string; flag: string };

/** Currencies offered when picking a default; PHP first as the app's starting default. */
export const currencies: Currency[] = [
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'GBP', name: 'Pound Sterling', flag: '🇬🇧' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
];
