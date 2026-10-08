import type { ImageSource } from 'expo-image';

import type { AvatarData } from '@/components/ui/Avatar';
import type { IconName } from '@/components/ui/Icon';

export type MonthlySummary = {
  income: number;
  expenses: number;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
  /** Last four digits of a linked card. */
  last4?: string;
  /** Free-form note shown when there's no card number, e.g. the bank name. */
  description?: string;
  /** Id from `accountTypes` (savings, cash, …). */
  typeId?: string;
  /** Optional hero artwork shown on the card instead of the wallet icon. */
  artwork?: ImageSource | number;
};

export type Budget = {
  id: string;
  category: string;
  /** Id from `budgetCategories`, used for the category's illustration. */
  categoryId?: string;
  spent: number;
  limit: number;
};

export type SharedDebt = {
  id: string;
  title: string;
  /** Emoji shown in the bill's icon tile. */
  emoji?: string;
  collected: number;
  total: number;
  participants: AvatarData[];
  /**
   * Your side of the bill: `collector` if you're owed the money (e.g. you created it), `payer` if
   * you owe someone. Defaults to `payer`.
   */
  role?: 'collector' | 'payer';
  /** Who you owe, shown on the payer view. */
  collectorName?: string;
};

/** One entry in a shared bill's transaction history. */
export type BillActivity = {
  id: string;
  person: AvatarData;
  action: 'paid' | 'requested';
  date: Date;
  amount: number;
};

export type BillsSummary = {
  owedToYou: number;
  youOwe: number;
};

export type TransactionKind = 'income' | 'expense';

export type Transaction = {
  id: string;
  title: string;
  /** Human-readable relative date, e.g. "Today". */
  dateLabel: string;
  /** Signed amount: positive = money in, negative = money out. */
  amount: number;
  icon: { type: 'icon'; name: IconName } | { type: 'artwork'; source: ImageSource | number };
  /** Tint of the icon tile. */
  tone: 'success' | 'danger';
};

/** The signed-in user's profile and app preferences. */
export type Profile = {
  name: string;
  email: string;
  phone: string;
  birthday: Date;
  photo: ImageSource | number;
  verified: boolean;
  currency: string;
  appearance: string;
};

/** Which notifications the user wants. New-device sign-in alerts are always on, so they aren't stored. */
export type NotificationPreferences = {
  push: boolean;
  moneyReceived: boolean;
  moneySent: boolean;
  lowBalance: boolean;
  /** Balance below which the low-balance alert fires. */
  lowBalanceThreshold: number;
  upcomingBills: boolean;
  budgetUpdates: boolean;
  productUpdates: boolean;
};

export type SecurityPreferences = {
  faceId: boolean;
  twoStepVerification: boolean;
  usageAnalytics: boolean;
  profileVisibility: 'Private' | 'Friends' | 'Public';
  passwordUpdatedAt: Date;
  trustedDevices: number;
};
