import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BillActivityRow } from '@/components/bills';
import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import {
  AppText,
  AvatarStack,
  BrandGradient,
  Card,
  Icon,
  IconButton,
  ProgressBar,
  ScreenBackground,
} from '@/components/ui';
import { useBills } from '@/data/billsStore';
import { billActivity } from '@/data/mock';
import type { SharedDebt } from '@/data/types';
import { colors, radii, spacing } from '@/theme';
import { formatCurrency, ratio } from '@/utils/format';

const goBack = () => router.back();

/** The collector sees what's left to collect; a payer sees what they still owe, and to whom. */
const remainingLabel = ({ role, collectorName }: SharedDebt) =>
  role === 'collector'
    ? 'Remaining Balance to collect'
    : `Remaining balance you owe${collectorName ? ` to ${collectorName}` : ''}`;

export function BillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();

  const bills = useBills();
  const bill = bills.find((item) => item.id === id);
  const activity = billActivity[id] ?? [];

  return (
    <View style={styles.screen}>
      {/* Opaque backdrop so the bills list underneath in the stack doesn't show through. */}
      <ScreenBackground />

      <View style={[styles.header, { marginTop: insets.top }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={4}
          onPress={goBack}
          style={({ pressed }) => pressed && styles.pressed}>
          <Icon name="backButton" />
        </Pressable>
        <AppText variant="sheetTitle" numberOfLines={1} accessibilityRole="header" style={styles.title}>
          {bill?.title ?? 'Bill not found'}
        </AppText>
        {/* TODO: open bill settings once that flow is designed. */}
        <IconButton icon="settingsSm" accessibilityLabel="Bill settings" style={!bill && styles.hidden} disabled={!bill} />
      </View>

      {bill ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 24 }]}>
          <Card radius={radii.xxxl} style={styles.summary}>
            <View style={styles.row}>
              <View style={styles.stack}>
                <AppText variant="fieldLabel" color="textSecondary">
                  Total Collected
                </AppText>
                <View style={styles.ratio}>
                  <AppText variant="amountXl">{formatCurrency(bill.collected)}</AppText>
                  <AppText variant="bodyMd" color="textSecondary">
                    / {formatCurrency(bill.total)}
                  </AppText>
                </View>
              </View>
              {/* TODO: record a payment once that flow is designed. */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add payment"
                style={({ pressed }) => [styles.addPayment, pressed && styles.pressed]}>
                <View style={styles.addPaymentFill}>
                  <BrandGradient />
                </View>
                <Icon name="addWhite" />
              </Pressable>
            </View>

            <ProgressBar progress={ratio(bill.collected, bill.total)} height={8} />

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.stack}>
                <AppText variant="fieldLabelSm" color="textSecondary" numberOfLines={1}>
                  {remainingLabel(bill)}
                </AppText>
                <AppText variant="cardTitle" color="danger">
                  {formatCurrency(Math.max(0, bill.total - bill.collected), { decimals: 2 })}
                </AppText>
              </View>
              <AvatarStack people={bill.participants} />
            </View>
          </Card>

          <View style={styles.history}>
            <View style={styles.row}>
              <AppText variant="sectionTitleBold" accessibilityRole="header">
                Transaction History
              </AppText>
              {/* TODO: export the history once downloads are supported. */}
              <Pressable accessibilityRole="button" hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
                <AppText variant="labelSemibold" color="success">
                  Download
                </AppText>
              </Pressable>
            </View>

            {activity.length > 0 ? (
              <View style={styles.historyCard}>
                {activity.map((entry) => (
                  <BillActivityRow key={entry.id} activity={entry} />
                ))}
              </View>
            ) : (
              <AppText variant="caption" color="textSecondary">
                No transactions yet.
              </AppText>
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: spacing.screenX,
  },
  title: {
    flexShrink: 1,
  },
  hidden: {
    opacity: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: spacing.screenX,
  },
  // Figma keeps 1pt strokes out of the layout; React Native pads inside the border.
  summary: {
    gap: 16,
    padding: 20 - 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  stack: {
    flexShrink: 1,
    gap: 2,
  },
  ratio: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  addPayment: {
    width: 40,
    height: 40,
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addPaymentFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  // Drawn without taking up space, like Figma's zero-height line.
  divider: {
    height: 1,
    marginBottom: -1,
    backgroundColor: colors.track,
  },
  history: {
    gap: 12,
  },
  historyCard: {
    paddingHorizontal: 16 - 1,
    paddingVertical: 4 - 1,
    borderRadius: radii.xxxl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
