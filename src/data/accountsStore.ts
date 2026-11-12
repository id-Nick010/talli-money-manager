import { supabase } from '@/lib/supabase';

import { createListStore } from './createListStore';
import type { Account } from './types';

/** The public.accounts columns the app reads. */
const COLUMNS = 'id, account_name, description, type, balance';

type AccountRow = {
  id: string;
  account_name: string;
  description: string | null;
  type: string | null;
  balance: number | string;
};

function toAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.account_name,
    // Postgres numeric can arrive as a string, so it's converted explicitly.
    balance: Number(row.balance),
    description: row.description ?? undefined,
    typeId: row.type ?? undefined,
  };
}

const store = createListStore<Account>([]);

export const useAccounts = store.useItems;
export const getAccounts = store.getItems;

/** Loads the signed-in user's accounts, oldest first, so the first one stays the default. */
export async function loadAccounts() {
  // RLS only returns the signed-in user's rows, so there's no user filter here.
  const { data, error } = await supabase.from('accounts').select(COLUMNS).order('created_at');
  if (error) {
    console.warn('Could not load accounts', error.message);
    return;
  }
  store.set(data.map(toAccount));
}

/** Forgets the previous user's accounts on sign-out. */
export function clearAccounts() {
  store.set([]);
}

export type NewAccount = {
  name: string;
  description?: string;
  /** The starting balance entered when adding the account. */
  balance: number;
  typeId: string;
};

/** Resolves to an error message to show, or null once the account is saved. */
export async function addAccount({ name, description, balance, typeId }: NewAccount) {
  // user_id is filled in by the database from the signed-in user.
  const { data, error } = await supabase
    .from('accounts')
    .insert({ account_name: name, description: description ?? null, type: typeId, balance })
    .select(COLUMNS)
    .single();
  if (error) return error.message;
  store.add(toAccount(data));
  return null;
}
