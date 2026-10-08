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

import { useSignedIn } from '@/data/authStore';
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

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Signing in or out swaps which group is reachable; the router moves to the first open screen. */}
        <Stack.Protected guard={signedIn}>
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
