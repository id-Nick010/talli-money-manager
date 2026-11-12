import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Icon, ScreenBackground } from '@/components/ui';
import { spacing } from '@/theme';

type Props = {
  title: string;
  subtitle: string;
  /** Space between the page's sections (Figma: 30pt on Sign up, 40pt on Log in). */
  gap: number;
  /** Extra space above the logo (Figma: 12pt on Log in). */
  paddingTop?: number;
  children: ReactNode;
};

/** Shared frame of the Sign up and Log in screens: backdrop, logo, headline, then the form. */
export function AuthLayout({ title, subtitle, gap, paddingTop = 0, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScreenBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          styles.content,
          { gap, paddingTop: insets.top + paddingTop, paddingBottom: insets.bottom + 20 },
        ]}>
        <View accessible accessibilityRole="image" accessibilityLabel="Talli" style={styles.logo}>
          <Icon name="talliLogo" />
        </View>

        <View style={styles.intro}>
          <AppText variant="authTitle" accessibilityRole="header">
            {title}
          </AppText>
          <AppText variant="authSubtitle" color="textSecondary">
            {subtitle}
          </AppText>
        </View>

        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenX,
  },
  logo: {
    alignItems: 'center',
  },
  intro: {
    gap: 6,
  },
});
