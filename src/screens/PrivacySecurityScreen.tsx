import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { SettingsGroup, SettingsRow } from '@/components/settings';
import { PageHeader, ScreenBackground } from '@/components/ui';
import { saveSecurityPreferences, useSecurityPreferences } from '@/data/securityStore';
import type { SecurityPreferences } from '@/data/types';
import { spacing } from '@/theme';
import { formatTimeAgo } from '@/utils/date';

type Switch = 'faceId' | 'twoStepVerification' | 'usageAnalytics';

// TODO: open Change password, Profile visibility, Download my data and Trusted devices once those
// flows are designed.
export function PrivacySecurityScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const saved = useSecurityPreferences();
  const [draft, setDraft] = useState<SecurityPreferences>(saved);

  // This page's switches use flat brand green rather than the gradient, as in Figma.
  const toggle = (key: Switch) => ({
    value: draft[key],
    onChange: (value: boolean) => setDraft((current) => ({ ...current, [key]: value })),
    fill: 'solid' as const,
  });

  const update = () => {
    saveSecurityPreferences(draft);
    router.back();
  };

  return (
    <View style={styles.screen}>
      {/* Opaque backdrop so the settings page underneath in the stack doesn't show through. */}
      <ScreenBackground />

      <View style={{ marginTop: insets.top }}>
        <PageHeader title="Privacy & Security" actionLabel="Update" onPressAction={update} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 14 }]}>
        <SettingsGroup title="Login security">
          <SettingsRow
            icon="keyRound"
            title="Change password"
            subtitle={`Updated ${formatTimeAgo(draft.passwordUpdatedAt)}`}
          />
          <SettingsRow icon="scanFace" title="Use Face ID" subtitle="Quick, secure sign-in" toggle={toggle('faceId')} />
          <SettingsRow
            icon="shieldPlus"
            title="2-step verification"
            subtitle="Recommended for extra protection"
            toggle={toggle('twoStepVerification')}
          />
        </SettingsGroup>

        <SettingsGroup title="Privacy controls">
          <SettingsRow icon="eye" title="Profile visibility" value={draft.profileVisibility} />
          <SettingsRow
            icon="barChart3"
            title="Usage analytics"
            subtitle="Help improve your experience"
            toggle={toggle('usageAnalytics')}
          />
          <SettingsRow icon="fileLock" title="Download my data" subtitle="Request a secure account archive" />
        </SettingsGroup>

        <SettingsGroup title="Device access">
          <SettingsRow icon="smartphone" title="Trusted devices" value={`${draft.trustedDevices} active`} />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingTop: 10,
    paddingHorizontal: spacing.screenX,
  },
});
