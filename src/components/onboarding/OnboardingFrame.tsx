import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Icon, ScreenBackground } from '@/components/ui';
import { finishOnboarding } from '@/data/authStore';
import { usePreferences } from '@/data/preferencesStore';
import { useProfile } from '@/data/profileStore';
import { colors, radii, spacing } from '@/theme';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  onBack: () => void;
  /** The page between the navigation row and the footer; it fills the leftover height. */
  children: ReactNode;
  /** Pinned below the page, usually the primary action. */
  footer: ReactNode;
  /** Minimum space above the footer (Figma: 51pt on the welcome step, 20pt on the others). */
  footerGap?: number;
  /** Space between the navigation row and the page (Figma: 16pt on Appearance, 24pt elsewhere). */
  pageGap?: number;
  /**
   * Holds the navigation, page and footer in place instead of scrolling the whole screen; the page
   * scrolls its own long list (the currency list) and the footer sits on a mint panel.
   */
  fixed?: boolean;
};

/** Shared frame of the onboarding steps: backdrop, back button and Skip, then the page and its action. */
export function OnboardingFrame({ onBack, children, footer, footerGap = 20, pageGap = 24, fixed = false }: Props) {
  const insets = useSafeAreaInsets();
  const { currency, appearance } = useProfile();
  const { primaryFeature } = usePreferences();
  // Skipping keeps whatever the earlier steps already chose (or the defaults).
  const skip = () => finishOnboarding({ currency, appearance, primaryFeature });

  const body = (
    <>
      <View style={styles.nav}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={4}
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Icon name="onboardingChevronLeft" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={skip}
          style={({ pressed }) => pressed && styles.pressed}>
          <AppText variant="labelSemibold" color="brand">
            Skip
          </AppText>
        </Pressable>
      </View>

      <View style={[styles.page, { marginTop: pageGap }]}>{children}</View>
    </>
  );

  return (
    <View style={styles.screen}>
      <ScreenBackground />
      {fixed ? (
        <>
          <View style={[styles.content, styles.fixedContent, { paddingTop: insets.top + 8 }]}>{body}</View>
          <View style={[styles.fixedFooter, { paddingBottom: insets.bottom + 18 }]}>{footer}</View>
        </>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 18 }]}>
          {body}
          <View style={{ paddingTop: footerGap }}>{footer}</View>
        </ScrollView>
      )}
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
  fixedContent: {
    flex: 1,
  },
  nav: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  page: {
    flex: 1,
  },
  fixedFooter: {
    paddingTop: 18,
    paddingHorizontal: spacing.screenX,
    backgroundColor: colors.brandMist,
  },
});
