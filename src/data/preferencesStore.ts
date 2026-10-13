import { createValueStore } from './createValueStore';

export type PrimaryFeature = 'transactions' | 'accounts' | 'budgets' | 'bills';

type Preferences = {
  /** The part of Talli the user said they're most interested in during onboarding. */
  primaryFeature: PrimaryFeature | null;
};

/** Demo-only: kept in memory until the real database is wired up. */
const store = createValueStore<Preferences>({ primaryFeature: null });

export const usePreferences = store.useValue;

export function setPrimaryFeature(primaryFeature: PrimaryFeature) {
  store.update({ primaryFeature });
}
