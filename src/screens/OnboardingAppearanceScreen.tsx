import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PillButton } from '@/components/auth';
import { AppearanceChoice, AppearancePlaceholder, FooterNote, OnboardingFrame } from '@/components/onboarding';
import { AppText } from '@/components/ui';
import { finishOnboarding } from '@/data/authStore';
import { setAppearance, useProfile } from '@/data/profileStore';

const APPEARANCES = [
  { id: 'Light', tagline: 'Fresh & airy', preview: require('@/assets/images/appearance-light.png') },
  { id: 'Dark', tagline: 'Soft on the eyes', preview: require('@/assets/images/appearance-dark.png') },
] as const;

type Appearance = (typeof APPEARANCES)[number]['id'];

export function OnboardingAppearanceScreen() {
  const current = useProfile().appearance;
  const [selected, setSelected] = useState<Appearance>(current === 'Dark' ? 'Dark' : 'Light');

  // TODO: the app only draws its light theme so far; this saves the choice for when Dark lands.
  // Open the next onboarding step once it's designed; until then this finishes onboarding and the
  // protected routes move to the dashboard.
  const next = () => {
    setAppearance(selected);
    finishOnboarding();
  };

  return (
    <OnboardingFrame
      onBack={() => router.back()}
      pageGap={16}
      footer={
        <View style={styles.next}>
          <FooterNote>You can change your appearance anytime in Settings.</FooterNote>
          <PillButton label={`Use ${selected} and continue`} icon="onboardingArrowRight" onPress={next} />
        </View>
      }>
      <View style={styles.page}>
        <View style={styles.intro}>
          <AppText variant="authTitle" accessibilityRole="header">
            Tired of boring money trackers?
          </AppText>
          <AppText variant="onboardingBody" color="textSecondary">
            Make Talli feel like you. Choose the look for your everyday money moments.
          </AppText>
        </View>

        <View style={styles.grid}>
          <View accessibilityRole="radiogroup" style={styles.row}>
            {APPEARANCES.map((appearance) => (
              <AppearanceChoice
                key={appearance.id}
                title={appearance.id}
                tagline={appearance.tagline}
                preview={appearance.preview}
                selected={selected === appearance.id}
                onPress={() => setSelected(appearance.id)}
              />
            ))}
          </View>
          <View style={styles.row}>
            <AppearancePlaceholder title="Future theme 1" />
            <AppearancePlaceholder title="Future theme 2" />
          </View>
        </View>
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 16,
  },
  intro: {
    gap: 10,
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  next: {
    gap: 12,
  },
});
