import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PillButton } from '@/components/auth';
import { FloatingWallet, OnboardingFrame } from '@/components/onboarding';
import { AppText, Icon } from '@/components/ui';
import { signOut } from '@/data/authStore';
import { useProfile } from '@/data/profileStore';

export function OnboardingScreen() {
  const firstName = useProfile().name.trim().split(/\s+/)[0];

  return (
    // The account already exists, so going back signs out and returns to Sign up.
    <OnboardingFrame
      onBack={signOut}
      footerGap={51}
      footer={
        <PillButton
          label="Let’s make it yours"
          icon="onboardingArrowRight"
          onPress={() => router.push('/onboarding/start')}
        />
      }>
      <View style={styles.body}>
        <View style={styles.intro}>
          <AppText variant="authTitle" accessibilityRole="header">
            {firstName ? `Hi ${firstName}.\n` : ''}Let’s grow your wealth.
          </AppText>
          <AppText variant="onboardingBody" color="textSecondary">
            We’re here to help you manage money, one everyday decision at a time. Tell us what matters to you. Then
            take a quick look at how Talli fits into your day.
          </AppText>
          <View style={styles.reassurance}>
            <Icon name="heartHandshake" />
            <AppText variant="onboardingNote" color="textSecondary" style={styles.reassuranceText}>
              No need to have it all figured out.
            </AppText>
          </View>
        </View>

        <FloatingWallet />
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  intro: {
    alignSelf: 'stretch',
    gap: 10,
  },
  reassurance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reassuranceText: {
    flex: 1,
  },
});
