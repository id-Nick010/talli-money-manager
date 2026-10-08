import { useSyncExternalStore } from 'react';

/**
 * Demo-only, in-memory single value (e.g. the profile): edits last until the app reloads. Swap the
 * stores built on this for the real database later; screens only use each store's hook and setter.
 */
export function createValueStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const getSnapshot = () => value;

  return {
    useValue: () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot),
    update: (changes: Partial<T>) => {
      value = { ...value, ...changes };
      listeners.forEach((listener) => listener());
    },
  };
}
