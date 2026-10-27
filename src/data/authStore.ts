import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

import { createValueStore } from './createValueStore';
import { setPrimaryFeature, type PrimaryFeature } from './preferencesStore';
import { setAppearance, setCurrency, updateProfile } from './profileStore';

type AuthState = {
  /** False until the saved session (and its user row) has been checked on launch. */
  ready: boolean;
  session: Session | null;
  /** The signed-in user's public.users.id, which accounts.user_id points at. */
  userId: string | null;
  /** True for a signed-in user who hasn't finished the welcome flow. */
  onboarding: boolean;
};

const store = createValueStore<AuthState>({ ready: false, session: null, userId: null, onboarding: false });

/** True once launch has restored (or ruled out) a saved session; the splash stays up until then. */
export const useAuthReady = () => store.useValue().ready;

export const useSignedIn = () => store.useValue().session !== null;

/** True between creating an account and finishing the welcome flow. */
export const useOnboarding = () => store.useValue().onboarding;

/** The signed-in user's public.users.id, for code outside React (e.g. saving an account). */
export const getUserId = () => store.getValue().userId;

async function applySession(session: Session | null) {
  if (!session) {
    store.update({ ready: true, session: null, userId: null, onboarding: false });
    return;
  }

  // A token refresh keeps the same user, so there's no need to load the row again.
  const current = store.getValue();
  if (current.userId && current.session?.user.id === session.user.id) {
    store.update({ session });
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, user_name, currency, appearance, primary_feature, onboarded')
    .eq('auth_user_id', session.user.id)
    .single();
  if (error) console.warn('Could not load the signed-in user', error.message);

  if (data) {
    updateProfile({ name: data.user_name ?? '', email: session.user.email ?? '' });
    setCurrency(data.currency);
    setAppearance(data.appearance);
    if (data.primary_feature) setPrimaryFeature(data.primary_feature as PrimaryFeature);
  }

  // Session and onboarding change together, so the router never shows the tabs for a frame first.
  store.update({ ready: true, session, userId: data?.id ?? null, onboarding: data ? !data.onboarded : false });
}

// Fires once on launch with the saved session, then on every sign-in, sign-out and token refresh.
// Supabase warns against awaiting its own calls inside this callback, so the work is deferred.
supabase.auth.onAuthStateChange((_event, session) => {
  setTimeout(() => applySession(session), 0);
});

/** Resolves to an error message to show, or null once the user is signed in. */
export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // The on_auth_user_created trigger copies this into public.users.user_name.
    options: { data: { full_name: name } },
  });
  if (error) return error.message;
  // With "Confirm email" on, there's no session until the user opens the link.
  if (!data.session) return 'Check your inbox to confirm your email, then log in.';
  return null;
}

/** Resolves to an error message to show, or null once the user is signed in. */
export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

type OnboardingChoices = {
  currency: string;
  appearance: string;
  primaryFeature: PrimaryFeature | null;
};

export async function finishOnboarding({ currency, appearance, primaryFeature }: OnboardingChoices) {
  const { userId } = store.getValue();
  if (!userId) return;
  const { error } = await supabase
    .from('users')
    .update({ currency, appearance, primary_feature: primaryFeature, onboarded: true })
    .eq('id', userId);
  if (error) console.warn('Could not save onboarding', error.message);
  // Move on even if saving failed, so the user isn't stuck; they'd see onboarding again next launch.
  store.update({ onboarding: false });
}

/** The session clears, and onAuthStateChange sends the user back to Sign up. */
export async function signOut() {
  await supabase.auth.signOut();
}
