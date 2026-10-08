import { router } from 'expo-router';

import { AddAccountSheet, type AccountDraft } from '@/components/accounts';
import { addAccount } from '@/data/accountsStore';

const close = () => router.back();

// Demo only: kept in memory until the real database is wired up.
const save = ({ name, description, initialBalance, typeId }: AccountDraft) =>
  addAccount({ name, description: description || undefined, balance: initialBalance, typeId });

export default function AddAccountScreen() {
  return <AddAccountSheet onClose={close} onSubmit={save} />;
}
