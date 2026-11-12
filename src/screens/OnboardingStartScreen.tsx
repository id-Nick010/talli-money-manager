import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PillButton } from '@/components/auth';
import { ChoiceCard, FeatureSymbol, OnboardingFrame } from '@/components/onboarding';
import { AppText, type IconName } from '@/components/ui';
import { setPrimaryFeature, usePreferences, type PrimaryFeature } from '@/data/preferencesStore';

const FEATURES: { id: PrimaryFeature; icon: IconName; title: string; description: string }[] = [
  {
    id: 'transactions',
    icon: 'arrowLeftRight',
    title: 'Track transactions',
    description: 'Manually log expenses, income & transfers.',
  },
  { id: 'accounts', icon: 'walletCardsMd', title: 'See my accounts', description: 'Keep balances and net worth in view.' },
  { id: 'budgets', icon: 'chartPie', title: 'Plan monthly budgets', description: 'Set spending limits by category.' },
  { id: 'bills', icon: 'receipt', title: 'Manage shared bills', description: 'Split amounts and track what’s owed.' },
];

export function OnboardingStartScreen() {
  // Figma preselects the first choice so Continue always has an answer.
  const [selected, setSelected] = useState<PrimaryFeature>(usePreferences().primaryFeature ?? 'transactions');

  const next = () => {
    setPrimaryFeature(selected);
    router.push('/onboarding/currency');
  };

  return (
    <OnboardingFrame
      onBack={() => router.back()}
      footer={
        <View style={styles.next}>
          <AppText variant="onboardingNote" color="textSecondary" style={styles.hint}>
            You can explore the other features too.
          </AppText>
          <PillButton label="Continue" icon="onboardingArrowRight" onPress={next} />
        </View>
      }>
      <View style={styles.page}>
        <View style={styles.intro}>
          <AppText variant="authTitle" accessibilityRole="header">
            Where would you like to start?
          </AppText>
          <AppText variant="onboardingBody" color="textSecondary">
            Choose the part of Talli you’re most interested in using.
          </AppText>
        </View>

        <View accessibilityRole="radiogroup" style={styles.choices}>
          {FEATURES.map((feature) => (
            <ChoiceCard
              key={feature.id}
              symbol={<FeatureSymbol icon={feature.icon} />}
              title={feature.title}
              description={feature.description}
              selected={selected === feature.id}
              onPress={() => setSelected(feature.id)}
            />
          ))}
        </View>
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 24,
  },
  intro: {
    gap: 10,
  },
  choices: {
    gap: 12,
  },
  next: {
    gap: 12,
  },
  hint: {
    textAlign: 'center',
  },
});
