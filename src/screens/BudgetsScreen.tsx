import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SavedBudgetRow } from '@/components/budgets';
import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { AppText, Card, Icon, ProgressBar, ScreenBackground } from '@/components/ui';
import { useBudgets } from '@/data/budgetsStore';
import { currentMonth } from '@/data/mock';
import { colors, fonts, spacing } from '@/theme';
import { CURRENCY_SYMBOL, formatCurrency, ratio } from '@/utils/format';

/** Figma keeps 1pt strokes out of the padding; React Native pads inside the border. */
const STROKE = 1;

const goBack = () => router.back();

export function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const budgets = useBudgets();

  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const month = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.screen}>
      {/* Opaque backdrop so home underneath in the stack doesn't show through. */}
      <ScreenBackground />

      <View style={[styles.header, { marginTop: insets.top }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={4}
          onPress={goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Icon name="chevronLeft" />
        </Pressable>
        <AppText variant="pageTitle" numberOfLines={1} accessibilityRole="header" style={styles.title}>
          Monthly Budgets
        </AppText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 24 }]}>
        <Card radius={20} shadow="cardRaised" style={styles.summary}>
          <View style={styles.total}>
            <AppText variant="captionSm" color="textSecondary" style={styles.month}>
              {month}
            </AppText>
            <View style={styles.amounts}>
              <AppText variant="amountXl" style={styles.spent}>
                <AppText variant="amountXl" style={styles.currency}>
                  {CURRENCY_SYMBOL}
                </AppText>
                {formatCurrency(totalSpent).slice(CURRENCY_SYMBOL.length)}
              </AppText>
              <AppText variant="amountOf" color="textSecondary">
                {`/ ${formatCurrency(totalLimit)}`}
              </AppText>
            </View>
          </View>
          <View style={styles.allocation}>
            <ProgressBar progress={ratio(totalSpent, totalLimit)} trackColor={colors.ringTrack} minFill={6} />
            <AppText variant="captionSm" color="textSecondary" style={styles.month}>
              {`${formatCurrency(Math.max(0, totalLimit - totalSpent))} left to spend across your budgets`}
            </AppText>
          </View>
        </Card>

        <View style={styles.listHeader}>
          <AppText variant="rowTitle" accessibilityRole="header" style={styles.listTitle}>
            Monthly Budgets
          </AppText>
          {/* TODO: open budget management once that flow is designed. */}
          <Pressable accessibilityRole="button" hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
            <AppText variant="link" color="brand">
              Manage
            </AppText>
          </Pressable>
        </View>

        <View style={styles.list}>
          {budgets.map((budget) => (
            <SavedBudgetRow key={budget.id} budget={budget} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.screenX,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    flex: 1,
  },
  content: {
    gap: 14,
    paddingTop: 8,
    paddingHorizontal: spacing.screenX,
  },
  summary: {
    gap: 10,
    padding: 16 - STROKE,
  },
  total: {
    gap: 2,
  },
  month: {
    lineHeight: 15,
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spent: {
    lineHeight: 31,
  },
  currency: {
    fontFamily: fonts.displaySemibold,
  },
  allocation: {
    gap: 2,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    lineHeight: 17,
  },
  list: {
    gap: 8,
  },
});
