import { router } from 'expo-router';

import { AddTransactionSheet, type TransactionDraft } from '@/components/transaction';
import { addTransaction } from '@/data/transactionsStore';

const close = () => router.back();

const save = (draft: TransactionDraft) => {
  // TODO: transfers move money between accounts rather than adding income or spending; save them
  // once account balances are tracked.
  if (draft.kind === 'transfer') return;
  addTransaction(draft);
};

export default function AddTransactionScreen() {
  return <AddTransactionSheet onClose={close} onSubmit={save} />;
}
