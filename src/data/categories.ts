import type { TileArtwork } from '@/components/ui/CategoryTile';
import type { IconName } from '@/components/ui/Icon';

import type { TransactionKind } from './types';

export type TransactionCategory = {
  id: string;
  label: string;
  icon: IconName;
};

export const transactionCategories: Record<TransactionKind, TransactionCategory[]> = {
  expense: [
    { id: 'food', label: 'Food', icon: 'categoryFood' },
    { id: 'transport', label: 'Transport', icon: 'categoryTransport' },
    { id: 'shopping', label: 'Shopping', icon: 'categoryShopping' },
    { id: 'pet', label: 'Pet', icon: 'categoryPet' },
    { id: 'subscription', label: 'Subscription', icon: 'categorySubscription' },
    { id: 'utilities', label: 'Utilities', icon: 'categoryUtilities' },
  ],
  income: [
    { id: 'salary', label: 'Salary', icon: 'categorySalary' },
    { id: 'freelance', label: 'Freelance', icon: 'categoryFreelance' },
    { id: 'investment', label: 'Investment', icon: 'categoryInvestment' },
    { id: 'gift', label: 'Gift', icon: 'categoryGift' },
    { id: 'refund', label: 'Refund', icon: 'categoryRefund' },
  ],
};

export type IllustratedOption = {
  id: string;
  label: string;
  artwork: TileArtwork;
};

/** Artwork zoomed evenly around its frame's centre (Figma's square "fill" crops). */
function zoomed(source: number, x: number, y: number, size: number, scale: number): TileArtwork {
  const offset = -(scale - 1) / 2;
  return { source, x, y, width: size, height: size, image: { left: offset, top: offset, width: scale, height: scale } };
}

/** Account types offered when adding an account. */
export const accountTypes: IllustratedOption[] = [
  { id: 'savings', label: 'Savings', artwork: zoomed(require('@/assets/images/account-savings.png'), 4.5, 4, 30, 1.25) },
  { id: 'cash', label: 'Cash', artwork: zoomed(require('@/assets/images/account-cash.png'), 2, 2, 36, 1.41) },
  {
    id: 'investments',
    label: 'Investments',
    artwork: zoomed(require('@/assets/images/account-investments.png'), 5, 6, 30, 1.38),
  },
  {
    id: 'credit-card',
    label: 'Credit Card',
    artwork: zoomed(require('@/assets/images/account-credit-card.png'), 1.5, 2, 36, 1.2),
  },
  { id: 'e-wallet', label: 'E-wallets', artwork: zoomed(require('@/assets/images/account-e-wallet.png'), 5, 4, 36, 1.27) },
];

/** Spending categories a monthly budget can be set up for. */
export const budgetCategories: IllustratedOption[] = [
  {
    id: 'food',
    label: 'Food',
    artwork: {
      source: require('@/assets/images/budget-food.png'),
      x: 4.5,
      y: 4,
      width: 32,
      height: 32,
      image: { left: -0.3031, top: -0.1407, width: 1.45, height: 1.2815 },
    },
  },
  {
    id: 'transportation',
    label: 'Transportation',
    artwork: {
      source: require('@/assets/images/budget-transportation.png'),
      x: 4.5,
      y: 4,
      width: 32,
      height: 32,
      image: { left: -0.4, top: -0.2954, width: 1.8, height: 1.5908 },
    },
  },
  { id: 'shopping', label: 'Shopping', artwork: zoomed(require('@/assets/images/budget-shopping.png'), 3, 4, 32, 1.41) },
  { id: 'utilities', label: 'Utilities', artwork: zoomed(require('@/assets/images/budget-utilities.png'), 4.5, 4, 32, 1.49) },
  {
    id: 'subscription',
    label: 'Subscription',
    artwork: {
      source: require('@/assets/images/empty-transactions.png'),
      x: 5,
      y: 4,
      width: 31,
      height: 32,
      image: { left: -0.4516, top: -0.3166, width: 1.871, height: 1.6019 },
    },
  },
  { id: 'pet', label: 'Pet', artwork: zoomed(require('@/assets/images/budget-pet.png'), 1.5, 0, 36, 1.36) },
  {
    id: 'travel',
    label: 'Travel',
    artwork: {
      source: require('@/assets/images/budget-travel.png'),
      x: 1.5,
      y: 0,
      width: 36,
      height: 36,
      image: { left: -0.0589, top: -0.0033, width: 1.09, height: 1.09 },
    },
  },
  { id: 'rent', label: 'Rent', artwork: zoomed(require('@/assets/images/budget-rent.png'), 4.5, 4, 32, 1.33) },
  {
    id: 'entertainment',
    label: 'Entertainment',
    artwork: zoomed(require('@/assets/images/budget-entertainment.png'), 4.5, 4, 32, 1.5),
  },
  {
    id: 'misc',
    label: 'Misc',
    artwork: {
      source: require('@/assets/images/budget-misc.png'),
      x: 4.5,
      y: 4,
      width: 32,
      height: 32,
      image: { left: -0.15, top: -0.1578, width: 1.3, height: 1.3 },
    },
  },
];
