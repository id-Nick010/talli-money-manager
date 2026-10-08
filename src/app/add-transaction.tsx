import { router } from 'expo-router';

import { AddTransactionSheet, type TransactionDraft } from '@/components/transaction';

const close = () => router.back();

// TODO: persist the draft once a transactions store exists (the app currently runs on mock data).
const save = (_draft: TransactionDraft) => {};

export default function AddTransactionScreen() {
  return <AddTransactionSheet onClose={close} onSubmit={save} />;
}
