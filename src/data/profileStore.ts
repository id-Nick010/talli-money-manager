import { createValueStore } from './createValueStore';
import { currentUser } from './mock';
import type { Profile } from './types';

// Name and email come from Supabase once the session loads; the rest stays demo data for now.
const store = createValueStore<Profile>({ ...currentUser, name: '', email: '' });


export const useProfile = store.useValue;

export type ProfileDetails = Pick<Profile, 'name' | 'email' | 'phone' | 'birthday'>;

export function updateProfile(details: Partial<ProfileDetails>) {
  store.update(details);
}

export function setCurrency(currency: Profile['currency']) {
  store.update({ currency });
}

export function setAppearance(appearance: Profile['appearance']) {
  store.update({ appearance });
}
