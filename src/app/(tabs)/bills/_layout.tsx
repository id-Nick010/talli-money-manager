import { DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';

/**
 * The native stack paints its container with the theme's background, which would cover the tabs'
 * shared backdrop, so this stack gets a transparent one.
 */
const transparentTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

export default function BillsLayout() {
  return (
    <ThemeProvider value={transparentTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          // The list stays transparent over the tabs' shared backdrop; the detail page paints its own.
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </ThemeProvider>
  );
}
