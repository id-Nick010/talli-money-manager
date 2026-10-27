import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAuthReady, useOnboarding, useSignedIn } from '@/data/authStore';
import { fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

const sheetOptions = {
  presentation: 'transparentModal',
  animation: 'none',
  contentStyle: { backgroundColor: 'transparent' },
} as const;

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.displayRegular]: BricolageGrotesque_400Regular,
    [fonts.displayMedium]: BricolageGrotesque_500Medium,
    [fonts.displaySemibold]: BricolageGrotesque_600SemiBold,
    [fonts.displayBold]: BricolageGrotesque_700Bold,
    [fonts.bodyRegular]: require('@/assets/fonts/GeneralSans-Regular.otf'),
    [fonts.bodyMedium]: require('@/assets/fonts/GeneralSans-Medium.otf'),
    [fonts.bodySemibold]: require('@/assets/fonts/GeneralSans-Semibold.otf'),
    [fonts.bodyBold]: require('@/assets/fonts/GeneralSans-Bold.otf'),
  });

  const signedIn = useSignedIn();
  const onboarding = useOnboarding();
  const authReady = useAuthReady();

  useEffect(() => {
    if ((loaded || error) && authReady) SplashScreen.hideAsync();
  }, [loaded, error, authReady]);

  // Stay on the splash until fonts and the saved session are both ready, so a signed-in user
  // never sees Sign up for a frame.
  if ((!loaded && !error) || !authReady) return null;


  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Signing in or out swaps which group is reachable; the router moves to the first open screen. */}
        {/* A new account sees onboarding first; finishing it opens the dashboard. */}
        <Stack.Protected guard={signedIn && onboarding}>
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        </Stack.Protected>
        <Stack.Protected guard={signedIn && !onboarding}>
          <Stack.Screen name="(tabs)" />
          {/* Sheets draw their own scrim and slide-up animation over the current tab. */}
          <Stack.Screen name="add-transaction" options={sheetOptions} />
          <Stack.Screen name="add-bill" options={sheetOptions} />
          <Stack.Screen name="add-account" options={sheetOptions} />
          <Stack.Screen name="budget-setup" options={sheetOptions} />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="log-in" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
