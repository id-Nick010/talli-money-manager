import { router } from 'expo-router';

import { AddTransactionSheet, type TransactionDraft } from '@/components/transaction';
import { addTransaction, addTransfer } from '@/data/transactionsStore';

const close = () => router.back();

const save = (draft: TransactionDraft) => (draft.kind === 'transfer' ? addTransfer(draft) : addTransaction(draft));

export default function AddTransactionScreen() {
  return <AddTransactionSheet onClose={close} onSubmit={save} />;
}
