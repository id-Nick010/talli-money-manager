import { router } from 'expo-router';

import { AddBillSheet, type BillDraft } from '@/components/bills';
import { addBill } from '@/data/billsStore';

const close = () => router.back();

// Demo only: kept in memory until the real database is wired up.
const save = ({ name, amount, categoryId, users }: BillDraft) =>
  addBill({ title: name, total: amount, categoryId, people: users.map((user) => user.name) });

export default function AddBillScreen() {
  return <AddBillSheet onClose={close} onSubmit={save} />;
}
