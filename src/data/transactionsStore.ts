import { useMemo } from 'react';

import { supabase } from '@/lib/supabase';
import { fromDateKey, startOfMonth, toDateKey } from '@/utils/date';

import { loadAccounts, useAccounts } from './accountsStore';
import { expenseCategories, incomeCategories } from './categories';
import { createListStore } from './createListStore';
import type { MonthlySummary, Transaction, TransactionKind } from './types';

/** Category the add_transfer function gives a transfer's fee. */
const FEE_CATEGORY = 'fees';

/** How many of the latest transactions are loaded even when they're from earlier months (Home lists 5). */
const RECENT_COUNT = 5;

const COLUMNS = 'id, kind, amount, category, description, date_issued, created_at, account_primary, account_secondary';

type TransactionRow = {
  id: string;
  kind: TransactionKind | 'transfer';
  amount: number | string;
  category: string | null;
  description: string | null;
  date_issued: string;
  created_at: string;
  account_primary: string;
  account_secondary: string | null;
};

/** A saved transaction as stored; names and icons are worked out when it's shown. */
type TransactionRecord = {
  id: string;
  kind: TransactionKind | 'transfer';
  /** Positive; the direction comes from `kind`. */
  amount: number;
  categoryId: string | null;
  description: string;
  date: Date;
  createdAt: Date;
  /** The account money leaves (expense, transfer) or enters (income). */
  accountId: string;
  /** Where a transfer's money goes. */
  toAccountId: string | null;
};

function toRecord(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    kind: row.kind,
    // Postgres numeric can arrive as a string, so it's converted explicitly.
    amount: Number(row.amount),
    categoryId: row.category,
    description: row.description ?? '',
    date: fromDateKey(row.date_issued),
    createdAt: new Date(row.created_at),
    accountId: row.account_primary,
    toAccountId: row.account_secondary,
  };
}

const store = createListStore<TransactionRecord>([]);

/** Loads this month's transactions (for the totals) plus the latest few (for Recent Transactions). */
export async function loadTransactions() {
  const table = () => supabase.from('acc_transaction_logs').select(COLUMNS);
  // RLS only returns the signed-in user's rows, so there's no user filter here.
  const [month, recent] = await Promise.all([
    table().gte('date_issued', toDateKey(startOfMonth(new Date()))),
    table().order('date_issued', { ascending: false }).order('created_at', { ascending: false }).limit(RECENT_COUNT),
  ]);
  const error = month.error ?? recent.error;
  if (error) {
    console.warn('Could not load transactions', error.message);
    return;
  }
  // The two lists overlap, so each transaction is kept once.
  const byId = new Map<string, TransactionRecord>();
  for (const row of [...(month.data ?? []), ...(recent.data ?? [])]) byId.set(row.id, toRecord(row));
  store.set([...byId.values()]);
}

/** Forgets the previous user's transactions on sign-out. */
export function clearTransactions() {
  store.set([]);
}

function toTransaction(record: TransactionRecord, accountName: (id: string | null) => string): Transaction {
  const { id, kind, amount, categoryId, description, date } = record;

  if (kind === 'transfer') {
    return {
      id,
      kind,
      title: description || 'Transfer',
      date,
      accountName: `${accountName(record.accountId)} → ${accountName(record.toAccountId)}`,
      amount,
      icon: { type: 'icon', name: 'arrowLeftRight' },
    };
  }

  const category = (kind === 'expense' ? expenseCategories : incomeCategories).find(({ id }) => id === categoryId);
  return {
    id,
    kind,
    // An empty description falls back to the category, e.g. "Food".
    title: description || category?.label || (kind === 'expense' ? 'Expense' : 'Income'),
    date,
    accountName: accountName(record.accountId),
    amount: kind === 'expense' ? -amount : amount,
    icon: category
      ? { type: 'tile', artwork: category.artwork }
      : { type: 'icon', name: categoryId === FEE_CATEGORY ? 'receipt' : 'walletCards' },
  };
}

/** All loaded transactions, newest first. */
export function useTransactions() {
  const records = store.useItems();
  const accounts = useAccounts();
  return useMemo(() => {
    // Names are looked up when shown, so renaming an account updates its transactions too.
    const accountName = (id: string | null) => accounts.find((account) => account.id === id)?.name ?? 'Account';
    return [...records]
      // Same day: the one added last comes first, so a transfer's fee sits just above it.
      .sort((a, b) => b.date.getTime() - a.date.getTime() || b.createdAt.getTime() - a.createdAt.getTime())
      .map((record) => toTransaction(record, accountName));
  }, [records, accounts]);
}

/** This month's income and expenses. Transfers move money between accounts, so they count as neither. */
export function useMonthlySummary(): MonthlySummary {
  const records = store.useItems();
  return useMemo(() => {
    const monthStart = startOfMonth(new Date());
    // Summed in cents so ₱0.10 + ₱0.20 doesn't come out as ₱0.30000000000000004.
    let income = 0;
    let expenses = 0;
    for (const record of records) {
      if (record.date < monthStart) continue;
      const cents = Math.round(record.amount * 100);
      if (record.kind === 'income') income += cents;
      if (record.kind === 'expense') expenses += cents;
    }
    return { income: income / 100, expenses: expenses / 100 };
  }, [records]);
}

/** Balances change in the database (a trigger), so both lists reload after a save. */
const refresh = () => Promise.all([loadAccounts(), loadTransactions()]);

export type NewTransaction = {
  kind: TransactionKind;
  /** Positive; the sign comes from `kind`. */
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  accountId: string;
};

/** Resolves to an error message to show, or null once saved. */
export async function addTransaction({ kind, amount, description, date, categoryId, accountId }: NewTransaction) {
  // user_id is filled in by the database from the signed-in user.
  const { error } = await supabase.from('acc_transaction_logs').insert({
    kind,
    amount,
    category: categoryId,
    description: description || null,
    date_issued: toDateKey(date),
    account_primary: accountId,
  });
  if (error) return error.message;
  await refresh();
  return null;
}

export type NewTransfer = {
  amount: number;
  /** Charged to the sender on top of `amount` and logged as its own expense; 0 for none. */
  fee: number;
  description: string;
  date: Date;
  fromAccountId: string;
  toAccountId: string;
};

/**
 * Resolves to an error message to show, or null once saved. The add_transfer function checks the
 * sender has enough money and saves the transfer and its fee together, so neither is saved alone.
 */
export async function addTransfer({ amount, fee, description, date, fromAccountId, toAccountId }: NewTransfer) {
  const { error } = await supabase.rpc('add_transfer', {
    p_from: fromAccountId,
    p_to: toAccountId,
    p_amount: amount,
    p_fee: fee,
    p_description: description,
    p_date: toDateKey(date),
  });
  if (error) return error.message;
  await refresh();
  return null;
}
