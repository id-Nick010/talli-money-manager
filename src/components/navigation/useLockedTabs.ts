import { useAccounts } from '@/data/accountsStore';
import { useBills } from '@/data/billsStore';

/**
 * Tabs a new user can't open yet: Accounts and Bills need an account first, and Bills also needs
 * at least one shared bill. Maps each locked tab's route name to what unlocks it.
 */
export function useLockedTabs(): ReadonlyMap<string, string> {
  const hasAccount = useAccounts().length > 0;
  const hasBill = useBills().length > 0;

  const locked = new Map<string, string>();
  if (!hasAccount) {
    locked.set('accounts', 'Available after you add an account');
    locked.set('bills', 'Available after you add an account');
  } else if (!hasBill) {
    locked.set('bills', 'Available after you add a shared bill');
  }
  return locked;
}
