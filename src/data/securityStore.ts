import { createValueStore } from './createValueStore';
import { securityPreferences } from './mock';
import type { SecurityPreferences } from './types';

const store = createValueStore<SecurityPreferences>(securityPreferences);

export const useSecurityPreferences = store.useValue;

export function saveSecurityPreferences(preferences: SecurityPreferences) {
  store.update(preferences);
}
