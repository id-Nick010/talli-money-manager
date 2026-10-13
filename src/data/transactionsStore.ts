import { useMemo } from 'react';

import { getAccounts } from './accountsStore';
import { expenseCategories, incomeCategories } from './categories';
import { createListStore } from './createListStore';
import { createValueStore } from './createValueStore';
import { monthlySummary, recentTransactions } from './mock';
import type { Transaction, TransactionKind } from './types';

const store = createListStore<Transaction>(recentTransactions);
/** Starts from the demo month's totals; each saved income or expense adds to it. */
const summaryStore = createValueStore(monthlySummary);

/** All transactions, newest first. */
export function useTransactions() {
  const items = store.useItems();
  // Same day: the one added last comes first.
  return useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => b.item.date.getTime() - a.item.date.getTime() || b.index - a.index)
        .map(({ item }) => item),
    [items],
  );
}

export const useMonthlySummary = summaryStore.useValue;

export type NewTransaction = {
  kind: TransactionKind;
  /** Positive; the sign comes from `kind`. */
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  accountId: string;
};

// Demo only: kept in memory until the real database is wired up.
export function addTransaction({ kind, amount, description, date, categoryId, accountId }: NewTransaction) {
  const category = (kind === 'expense' ? expenseCategories : incomeCategories).find(({ id }) => id === categoryId);
  const account = getAccounts().find(({ id }) => id === accountId);

  store.add({
    id: `tx-${Date.now()}`,
    // An empty description falls back to the category, e.g. "Food".
    title: description || category?.label || (kind === 'expense' ? 'Expense' : 'Income'),
    date,
    accountName: account?.name ?? 'Account',
    amount: kind === 'expense' ? -amount : amount,
    icon: category ? { type: 'tile', artwork: category.artwork } : { type: 'icon', name: 'walletCards' },
  });

  const summary = summaryStore.getValue();
  summaryStore.update(
    kind === 'expense' ? { expenses: summary.expenses + amount } : { income: summary.income + amount },
  );
}
