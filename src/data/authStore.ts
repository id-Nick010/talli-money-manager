import { createValueStore } from './createValueStore';
import { SIMULATE_NEW_USER } from './mock';

/**
 * Demo-only sign-in state: a new user starts signed out and lands on Sign up; it resets when the
 * app reloads. Replace with the real auth session later.
 */
const store = createValueStore({ signedIn: !SIMULATE_NEW_USER });

export const useSignedIn = () => store.useValue().signedIn;

export function signIn() {
  store.update({ signedIn: true });
}

export function signOut() {
  store.update({ signedIn: false });
}
