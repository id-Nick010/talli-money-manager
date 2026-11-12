import { router } from 'expo-router';
import { useCallback, useRef } from 'react';

import { BudgetSetupSheet, type BudgetDraft } from '@/components/budgets';
import { addBudgets } from '@/data/budgetsStore';
import { budgetCategories } from '@/data/categories';

export default function BudgetSetupScreen() {
  const saved = useRef(false);

  // After saving, the sheet slides away and the saved budgets page opens in its place.
  const close = useCallback(() => {
    router.back();
    if (saved.current) router.push('/budgets');
  }, []);

  // Demo only: kept in memory until the real database is wired up.
  const save = useCallback((drafts: BudgetDraft[]) => {
    addBudgets(
      drafts.map(({ categoryId, limit }) => ({
        category: budgetCategories.find((category) => category.id === categoryId)?.label ?? categoryId,
        categoryId,
        limit,
      })),
    );
    saved.current = true;
  }, []);

  return <BudgetSetupSheet onClose={close} onSubmit={save} />;
}
