import { createListStore } from './createListStore';
import { accounts as initialAccounts } from './mock';
import type { Account } from './types';

const store = createListStore<Account>(initialAccounts);

export const useAccounts = store.useItems;

export type NewAccount = Omit<Account, 'id'>;

export function addAccount(account: NewAccount) {
  store.add({ ...account, id: `account-${Date.now()}` });
}
