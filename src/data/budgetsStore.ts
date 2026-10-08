import { createListStore } from './createListStore';
import { budgets as initialBudgets } from './mock';
import type { Budget } from './types';

const store = createListStore<Budget>(initialBudgets);

export const useBudgets = store.useItems;

export type NewBudget = { category: string; categoryId: string; limit: number };

export function addBudgets(budgets: NewBudget[]) {
  const now = Date.now();
  store.add(...budgets.map((budget, index) => ({ ...budget, id: `budget-${now}-${index}`, spent: 0 })));
}
