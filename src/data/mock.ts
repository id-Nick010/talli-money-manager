import type { AvatarData } from '@/components/ui/Avatar';

import type {
  Account,
  BillActivity,
  BillsSummary,
  Budget,
  MonthlySummary,
  NotificationPreferences,
  Profile,
  SecurityPreferences,
  SharedDebt,
  Transaction,
} from './types';

const people = {
  bob: {
    id: 'bob',
    name: 'Bob',
    image: require('@/assets/images/avatar-bob.jpg'),
    crop: { left: '-14.62%', top: '-1.79%', width: '175.66%', height: '100%' },
  },
  clara: { id: 'clara', name: 'Clara', image: require('@/assets/images/avatar-clara.jpg') },
} satisfies Record<string, AvatarData>;

/** The signed-in user, shown on the Profile & Settings tab. */
export const currentUser: Profile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@email.com',
  phone: '+63 917 684 2209',
  birthday: new Date(1994, 7, 14),
  photo: require('@/assets/images/avatar-alex.png'),
  verified: true,
  currency: 'PHP',
  appearance: 'Light',
};

export const notificationPreferences: NotificationPreferences = {
  push: true,
  moneyReceived: true,
  moneySent: true,
  lowBalance: true,
  lowBalanceThreshold: 2000,
  upcomingBills: true,
  budgetUpdates: false,
  productUpdates: false,
};

const today = new Date();

export const securityPreferences: SecurityPreferences = {
  faceId: true,
  twoStepVerification: false,
  usageAnalytics: false,
  profileVisibility: 'Private',
  passwordUpdatedAt: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
  trustedDevices: 2,
};

/**
 * Simulates a brand-new user with no data yet, so the home screen shows its empty state.
 * Set to `false` to see the dashboard with the demo data below.
 */
export const SIMULATE_NEW_USER = true;

export const currentMonth = new Date(2026, 8, 1);

export const monthlySummary: MonthlySummary = SIMULATE_NEW_USER
  ? { income: 0, expenses: 0 }
  : {
      income: 5200,
      expenses: 2340,
    };

const demoAccounts: Account[] = [
  {
    id: 'main',
    name: 'Main Account',
    balance: 4280.5,
    last4: '4820',
    artwork: require('@/assets/images/wallet-illustration.png'),
  },
  { id: 'savings', name: 'Savings', balance: 12750, last4: '4820', typeId: 'savings' },
  { id: 'investment', name: 'Investment', balance: 3420.8, last4: '4820' },
];

const demoBudgets: Budget[] = [
  { id: 'food', category: 'Food & Dining', spent: 340, limit: 500 },
  { id: 'shopping', category: 'Shopping', spent: 180, limit: 400 },
  { id: 'transport', category: 'Transport', spent: 95, limit: 150 },
  { id: 'entertainment', category: 'Entertainment', spent: 60, limit: 200 },
];

const demoBillsSummary: BillsSummary = {
  owedToYou: 325,
  youOwe: 13000.5,
};

const demoBills: SharedDebt[] = [
  {
    id: 'vietnam',
    title: 'Trip to Vietnam',
    emoji: '🇻🇳',
    role: 'collector',
    collected: 12000,
    total: 16000,
    participants: [people.bob, people.clara],
  },
  {
    id: 'kvm-spaylater',
    title: 'KVM Spaylater',
    emoji: '🔌',
    role: 'payer',
    collectorName: 'Nickolo',
    collected: 200,
    total: 900,
    participants: [people.bob],
  },
  {
    id: 'spotify-duo-sep',
    title: 'Spotify Duo September Subscription',
    emoji: '🎶',
    role: 'collector',
    collected: 900,
    total: 900,
    participants: [people.bob, people.clara],
  },
];

// History rows reuse the two sample photos, as in the Figma file.
const daphne: AvatarData = { ...people.bob, id: 'daphne', name: 'Daphne' };
const nickolo: AvatarData = { ...people.clara, id: 'nickolo', name: 'Nickolo' };

/** Transaction history per bill id, newest first. */
export const billActivity: Record<string, BillActivity[]> = {
  vietnam: [
    { id: 'vn-4', person: daphne, action: 'paid', date: new Date(2026, 8, 15, 10, 24), amount: 5000 },
    { id: 'vn-3', person: nickolo, action: 'paid', date: new Date(2026, 8, 14, 20, 42), amount: 4000 },
    { id: 'vn-2', person: nickolo, action: 'paid', date: new Date(2026, 8, 12, 14, 18), amount: 3000 },
    { id: 'vn-1', person: daphne, action: 'requested', date: new Date(2026, 8, 11, 9, 6), amount: 4000 },
  ],
  'kvm-spaylater': [
    { id: 'kvm-1', person: people.bob, action: 'paid', date: new Date(2026, 8, 10, 9, 6), amount: 200 },
  ],
  'spotify-duo-sep': [
    { id: 'sp-2', person: people.clara, action: 'paid', date: new Date(2026, 8, 3, 18, 30), amount: 450 },
    { id: 'sp-1', person: people.bob, action: 'paid', date: new Date(2026, 8, 2, 12, 15), amount: 450 },
  ],
};

const subscriptionArtwork = require('@/assets/images/tx-subscription.png');

const demoTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Spotify Premium',
    dateLabel: 'Today',
    amount: -114.5,
    icon: { type: 'artwork', source: subscriptionArtwork },
    tone: 'success',
  },
  {
    id: 'tx-2',
    title: 'Spotify Premium',
    dateLabel: 'Today',
    amount: -114.5,
    icon: { type: 'artwork', source: subscriptionArtwork },
    tone: 'success',
  },
  { id: 'tx-3', title: 'Transfer from Jake', dateLabel: 'Yesterday', amount: 45, icon: { type: 'icon', name: 'arrowDown' }, tone: 'success' },
  { id: 'tx-4', title: 'Uber Ride', dateLabel: 'Yesterday', amount: -18.5, icon: { type: 'icon', name: 'car' }, tone: 'danger' },
  { id: 'tx-5', title: 'Amazon', dateLabel: '2 days ago', amount: -34.99, icon: { type: 'icon', name: 'package' }, tone: 'danger' },
];

export const accounts: Account[] = SIMULATE_NEW_USER ? [] : demoAccounts;
export const budgets: Budget[] = SIMULATE_NEW_USER ? [] : demoBudgets;
export const recentTransactions: Transaction[] = SIMULATE_NEW_USER ? [] : demoTransactions;
export const bills: SharedDebt[] = SIMULATE_NEW_USER ? [] : demoBills;
export const billsSummary: BillsSummary = SIMULATE_NEW_USER ? { owedToYou: 0, youOwe: 0 } : demoBillsSummary;
