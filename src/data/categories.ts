import type { TileArtwork } from '@/components/ui/CategoryTile';

import type { Account } from './types';

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

/**
 * Expense categories in the Add Transaction sheet: the same illustrated tiles as budgets, except
 * that Figma sits the shopping cart 2pt further right on this sheet.
 */
export const expenseCategories: IllustratedOption[] = budgetCategories.map((category) =>
  category.id === 'shopping' ? { ...category, artwork: { ...category.artwork, x: 5 } } : category,
);

/** Income sources in the Add Transaction sheet. */
export const incomeCategories: IllustratedOption[] = [
  {
    id: 'salary',
    label: 'Salary',
    artwork: {
      source: require('@/assets/images/income-salary.png'),
      x: 4.5,
      y: 4,
      width: 31,
      height: 28,
      image: { left: -0.3873, top: -0.3098, width: 1.7746, height: 1.7364 },
    },
  },
  {
    id: 'freelance',
    label: 'Freelance',
    artwork: {
      source: require('@/assets/images/income-freelance.png'),
      x: 4.5,
      y: 6,
      width: 32,
      height: 32,
      image: { left: -0.26, top: -0.1717, width: 1.52, height: 1.3434 },
    },
  },
  {
    id: 'investment',
    label: 'Investment',
    artwork: zoomed(require('@/assets/images/account-investments.png'), 5, 6, 30, 1.38),
  },
  {
    id: 'gift',
    label: 'Gift',
    artwork: {
      source: require('@/assets/images/income-gift.png'),
      x: 4.5,
      y: 4,
      width: 32,
      height: 32,
      image: { left: -0.3528, top: -0.2312, width: 1.69, height: 1.4936 },
    },
  },
  { id: 'refund', label: 'Refund', artwork: zoomed(require('@/assets/images/income-refund.png'), 5, 4, 32, 1.29) },
];

/** Generic wallet shown for accounts without a type (e.g. "Main Account"). */
const walletArtwork = zoomed(require('@/assets/images/account-wallet.png'), 4, 4, 32, 1.26);

/** Illustration for an account's 40pt tile, from the type picked when it was added. */
export function accountArtwork(account: Account): TileArtwork {
  return accountTypes.find((type) => type.id === account.typeId)?.artwork ?? walletArtwork;
}
