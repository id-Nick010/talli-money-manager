import { createValueStore } from './createValueStore';
import { currentUser } from './mock';
import type { Profile } from './types';

const store = createValueStore<Profile>(currentUser);

export const useProfile = store.useValue;

export type ProfileDetails = Pick<Profile, 'name' | 'email' | 'phone' | 'birthday'>;

export function updateProfile(details: Partial<ProfileDetails>) {
  store.update(details);
}
