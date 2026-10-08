import type { AvatarData } from '@/components/ui/Avatar';

import { createListStore } from './createListStore';
import { bills as initialBills, billsSummary } from './mock';
import type { BillsSummary, SharedDebt } from './types';

/** Bills the user adds in the app; the demo's own bills stay in `mock.ts`. */
const added = createListStore<SharedDebt>([]);

/** Avatar colours for people added by name, cycled in order. */
const PERSON_COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#EF4444'];

/** Icon-tile emoji for each bill category. */
const CATEGORY_EMOJI: Record<string, string> = {
  food: '🍽️',
  transportation: '🚌',
  shopping: '🛍️',
  utilities: '🔌',
  subscription: '🔁',
  pet: '🐾',
  travel: '✈️',
  rent: '🏠',
  entertainment: '🎬',
  misc: '📦',
};

export function useBills() {
  const addedBills = added.useItems();
  return [...initialBills, ...addedBills];
}

/** The demo totals plus what people still owe you on the bills you added. */
export function useBillsSummary(): BillsSummary {
  const outstanding = added.useItems().reduce((sum, bill) => sum + Math.max(0, bill.total - bill.collected), 0);
  return { ...billsSummary, owedToYou: billsSummary.owedToYou + outstanding };
}

export type NewBill = { title: string; total: number; categoryId: string; people: string[] };

/** Adds a bill nobody has paid into yet; the user created it, so they're the one collecting. */
export function addBill({ title, total, categoryId, people }: NewBill) {
  const now = Date.now();
  const participants: AvatarData[] = people.map((name, index) => ({
    id: `person-${now}-${index}`,
    name,
    color: PERSON_COLORS[index % PERSON_COLORS.length],
  }));
  added.add({ id: `bill-${now}`, title, emoji: CATEGORY_EMOJI[categoryId], collected: 0, total, participants, role: 'collector' });
}
