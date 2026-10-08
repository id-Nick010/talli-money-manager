import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { SettingsGroup, SettingsRow } from '@/components/settings';
import { AppText, Icon, PageHeader, ScreenBackground, Toggle } from '@/components/ui';
import { saveNotificationPreferences, useNotificationPreferences } from '@/data/notificationsStore';
import type { NotificationPreferences } from '@/data/types';
import { colors, spacing } from '@/theme';
import { formatCurrency } from '@/utils/format';

type Preference = Exclude<keyof NotificationPreferences, 'lowBalanceThreshold'>;

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const saved = useNotificationPreferences();
  const [draft, setDraft] = useState(saved);

  /** Switch props for one preference; every alert is muted while push notifications are off. */
  const toggle = (key: Preference) => ({
    value: draft[key],
    onChange: (value: boolean) => setDraft((current) => ({ ...current, [key]: value })),
    disabled: key !== 'push' && !draft.push,
  });

  const save = () => {
    saveNotificationPreferences(draft);
    router.back();
  };

  const push = toggle('push');

  return (
    <View style={styles.screen}>
      {/* Opaque backdrop so the settings page underneath in the stack doesn't show through. */}
      <ScreenBackground />

      <View style={{ marginTop: insets.top }}>
        <PageHeader title="Notifications" actionLabel="Save" onPressAction={save} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 14 }]}>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Push notifications"
          accessibilityHint="Stay informed about money movement and account activity."
          accessibilityState={{ checked: push.value }}
          onPress={() => push.onChange(!push.value)}
          style={({ pressed }) => [styles.summary, pressed && styles.pressed]}>
          <View style={styles.summaryIcon}>
            <Icon name="bellRing" />
          </View>
          <View style={styles.summaryCopy}>
            <AppText variant="cardTitleSm">Push notifications</AppText>
            <AppText variant="captionSmTight" color="textSecondary">
              Stay informed about money movement and account activity.
            </AppText>
          </View>
          <Toggle value={push.value} />
        </Pressable>

        <SettingsGroup title="Money alerts">
          <SettingsRow
            icon="arrowDownToLine"
            title="Money received"
            subtitle="Deposits and incoming transfers"
            toggle={toggle('moneyReceived')}
          />
          <SettingsRow
            icon="arrowUpFromLine"
            title="Money sent"
            subtitle="Payments and outgoing transfers"
            toggle={toggle('moneySent')}
          />
          <SettingsRow
            icon="walletCardsSm"
            title="Low balance"
            subtitle={`When balance falls below ${formatCurrency(draft.lowBalanceThreshold)}`}
            toggle={toggle('lowBalance')}
          />
        </SettingsGroup>

        <SettingsGroup title="Bills & budgets">
          <SettingsRow
            icon="calendarClock"
            title="Upcoming bills"
            subtitle="Three days before due date"
            toggle={toggle('upcomingBills')}
          />
          <SettingsRow
            icon="barChart"
            title="Budget updates"
            subtitle="Weekly spending summary"
            toggle={toggle('budgetUpdates')}
          />
        </SettingsGroup>

        <SettingsGroup title="Security">
          {/* Sign-in alerts can't be turned off, so this switch is fixed on. */}
          <SettingsRow
            icon="smartphone"
            title="New device sign-in"
            subtitle="Always on for your protection"
            toggle={{ value: true }}
          />
          <SettingsRow
            icon="megaphone"
            title="Product updates"
            subtitle="New tools and helpful tips"
            toggle={toggle('productUpdates')}
          />
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
  summary: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // Figma keeps the 1pt stroke out of the padding; React Native pads inside the border.
    padding: 14 - 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.brandMintBorder,
    backgroundColor: colors.brandMint,
  },
  pressed: {
    opacity: 0.7,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
