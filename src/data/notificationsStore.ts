import { createValueStore } from './createValueStore';
import { notificationPreferences } from './mock';
import type { NotificationPreferences } from './types';

const store = createValueStore<NotificationPreferences>(notificationPreferences);

export const useNotificationPreferences = store.useValue;

export function saveNotificationPreferences(preferences: NotificationPreferences) {
  store.update(preferences);
}
