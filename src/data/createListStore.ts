import { useSyncExternalStore } from 'react';

/**
 * Demo-only, in-memory list: items live until the app reloads. Swap the stores built on this for
 * the real database later; screens only use each store's hook and `add`.
 */
export function createListStore<T>(initial: T[]) {
  let items = initial;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const getSnapshot = () => items;

  return {
    useItems: () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot),
    add: (...added: T[]) => {
      items = [...items, ...added];
      listeners.forEach((listener) => listener());
    },
  };
}
