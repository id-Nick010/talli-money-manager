import { createValueStore } from './createValueStore';
import { SIMULATE_NEW_USER } from './mock';

/**
 * Demo-only sign-in state: a new user starts signed out and lands on Sign up; it resets when the
 * app reloads. Replace with the real auth session later.
 */
const store = createValueStore({ signedIn: !SIMULATE_NEW_USER, onboarding: false });

export const useSignedIn = () => store.useValue().signedIn;

/** True between creating an account and finishing (or skipping) the welcome flow. */
export const useOnboarding = () => store.useValue().onboarding;

export function signIn() {
  store.update({ signedIn: true, onboarding: false });
}

/** A brand-new account signs in, then sees onboarding before the dashboard. */
export function signUp() {
  store.update({ signedIn: true, onboarding: true });
}

export function finishOnboarding() {
  store.update({ onboarding: false });
}

export function signOut() {
  store.update({ signedIn: false, onboarding: false });
}
