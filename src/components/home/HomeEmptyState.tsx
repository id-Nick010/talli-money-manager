import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, BrandGradient, Card, HorizontalList, Icon, SectionHeader, StatCard } from '@/components/ui';
import type { Account, Budget, MonthlySummary, SharedDebt } from '@/data/types';
import { colors, radii, shadows, spacing } from '@/theme';

import { AddCard } from './AddCard';
import { BalanceCard } from './BalanceCard';
import { BudgetCard } from './BudgetCard';
import { DebtCard } from './DebtCard';

/** The add-account button's Figma gradient (≈174°) in the button's own bounding box. */
const BUTTON_GRADIENT_VECTOR = { x1: 0.4873, y1: -0.3705, x2: 0.5127, y2: 1.3705 } as const;

/**
 * Figma keeps strokes out of auto-layout, so its padding is measured from the card's outer edge.
 * React Native pads inside the border, hence the 1pt subtracted from each bordered card's padding.
 */
const STROKE = 1;

type Props = {
  summary: MonthlySummary;
  /** The user's accounts; empty for a brand-new user. */
  accounts: Account[];
  /** Budgets set up so far; replace the setup card once there are any. */
  budgets: Budget[];
  /** Shared bills added so far; replace the setup card once there are any. */
  bills: SharedDebt[];
  onAddAccount?: () => void;
  onOpenAccounts?: () => void;
  onSetUpBudget?: () => void;
  onOpenBudgets?: () => void;
  onSplitBills?: () => void;
  onOpenBills?: () => void;
  onOpenBill?: (id: string) => void;
};

/**
 * Home while the user is getting started. With no accounts, everything below the account prompt is
 * dimmed and inert. Once an account exists it's shown in place of the prompt and budgets unlock;
 * shared debts unlock once budgets are set up.
 */
export function HomeEmptyState({
  summary,
  accounts,
  budgets,
  bills,
  onAddAccount,
  onOpenAccounts,
  onSetUpBudget,
  onOpenBudgets,
  onSplitBills,
  onOpenBills,
  onOpenBill,
}: Props) {
  const { income, expenses } = summary;
  const hasAccount = accounts.length > 0;

  return (
    <View style={styles.content}>
      <View style={styles.stats}>
        <StatCard size="dense" label="Total Income" amount={income} />
        <StatCard size="dense" label="Total Expenses" amount={expenses} />
        <StatCard size="dense" label="Net Savings" amount={income - expenses} />
      </View>

      <View style={styles.section}>
        {hasAccount ? (
          <>
            <SectionHeader title="My Accounts" onPress={onOpenAccounts} showChevron />
            <View style={styles.fullBleed}>
              <HorizontalList>
                {accounts.map((account, index) => (
                  <BalanceCard key={account.id} account={account} isDefault={index === 0} />
                ))}
                <AddCard label="Add account" onPress={onAddAccount} />
              </HorizontalList>
            </View>
          </>
        ) : (
          <>
            <SectionHeader title="My Accounts" badge="0 linked" />
            <AccountsEmptyCard onAddAccount={onAddAccount} />
          </>
        )}
      </View>

      <SetupSection
        title="Monthly Budgets"
        gap={12}
        locked={!hasAccount}
        onPressHeader={budgets.length > 0 ? onOpenBudgets : undefined}>
        {budgets.length > 0 ? (
          <View style={styles.fullBleed}>
            <HorizontalList>
              {budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </HorizontalList>
          </View>
        ) : (
          <SetupCard
            title="Spend with intention"
            description={
              hasAccount
                ? 'Set a monthly limit for each spending category.'
                : 'Add an account to set a monthly category limit.'
            }
            action="Set up budget"
            onPress={onSetUpBudget}
            artwork={<Image source={require('@/assets/images/empty-budget.png')} contentFit="cover" style={styles.budgetArt} />}
          />
        )}
      </SetupSection>

      {/* Shared debts unlock once the user has set up their monthly budgets. */}
      <SetupSection title="Shared Debts" gap={14} locked={budgets.length === 0} onPressHeader={onOpenBills}>
        {bills.length > 0 ? (
          <View style={styles.fullBleed}>
            <HorizontalList>
              {bills.map((bill) => (
                <DebtCard key={bill.id} debt={bill} width={276} onPress={() => onOpenBill?.(bill.id)} />
              ))}
              <AddCard label="Add shared bill" onPress={onSplitBills} />
            </HorizontalList>
          </View>
        ) : (
          <SetupCard
            title="Track and split bills"
            description="Share rent, utilities and other household bills."
            action="Split Bills"
            onPress={onSplitBills}
            artwork={
              <View style={styles.billsArtFrame}>
                <Image source={require('@/assets/images/empty-bills.png')} contentFit="cover" style={styles.billsArt} />
              </View>
            }
          />
        )}
      </SetupSection>

      <View style={styles.section}>
        <SectionHeader title="Recent Transactions" />
        <View style={styles.transactionsRow}>
          <View style={styles.transactionsTile}>
            <View style={styles.transactionsArtFrame}>
              <Image
                source={require('@/assets/images/empty-transactions.png')}
                contentFit="cover"
                style={styles.transactionsArt}
              />
            </View>
          </View>
          <View style={styles.transactionsCopy}>
            <AppText variant="titleSm" style={styles.transactionsTitle}>
              Your transactions will be shown here
            </AppText>
            <AppText variant="caption" color="textSecondary" style={styles.transactionsBody}>
              {hasAccount ? 'Tap + to log your first transaction.' : 'Add an account first to track transactions.'}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

function AccountsEmptyCard({ onAddAccount }: { onAddAccount?: () => void }) {
  return (
    <Card
      shadow="cardSoft"
      style={styles.accountCard}
      backdrop={
        <>
          <Image source={require('@/assets/images/empty-orbit.png')} contentFit="fill" style={styles.orbit} />
          <Image source={require('@/assets/images/empty-wallet.png')} contentFit="cover" style={styles.wallet} />
        </>
      }>
      <View style={styles.accountCopy}>
        <AppText variant="emptyTitle">Your money story starts here</AppText>
        <AppText variant="micro" color="textSecondary" style={styles.accountBody}>
          Add an account to see balances, spending, and savings come together in one calm view.
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onAddAccount}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
        <View style={styles.addButtonFill}>
          <BrandGradient vector={BUTTON_GRADIENT_VECTOR} />
        </View>
        <Icon name="plusSm" />
        <AppText variant="labelSemiboldMd" color="white">
          Add your first account
        </AppText>
      </Pressable>
    </Card>
  );
}

type SetupSectionProps = {
  title: string;
  gap: number;
  /** Not available yet: dimmed, with no interaction. */
  locked?: boolean;
  onPressHeader?: () => void;
  children: ReactNode;
};

function SetupSection({ title, gap, locked = false, onPressHeader, children }: SetupSectionProps) {
  return (
    <View
      style={[locked && styles.locked, { gap }]}
      pointerEvents={locked ? 'none' : 'auto'}
      accessibilityState={{ disabled: locked }}>
      <SectionHeader title={title} onPress={onPressHeader} showChevron />
      {children}
    </View>
  );
}

type SetupCardProps = {
  title: string;
  description: string;
  action: string;
  /** Illustration overlapping the card's right side; clipped to the card's row. */
  artwork: ReactNode;
  onPress?: () => void;
};

function SetupCard({ title, description, action, artwork, onPress }: SetupCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${action}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.setupRow, pressed && styles.pressed]}>
      <Card shadow="cardSoft" style={styles.setupCard}>
        <View style={styles.setupCopy}>
          <AppText variant="emptyTitle">{title}</AppText>
          <AppText variant="micro" color="textSecondary" style={styles.setupBody}>
            {description}
          </AppText>
        </View>
        <View style={styles.setupAction}>
          <AppText variant="link" color="brand">
            {action}
          </AppText>
          <Icon name="arrowRight" />
        </View>
      </Card>
      {artwork}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    // Figma puts the summary row 40pt below the header's centre line; the shared header leaves 36.5.
    paddingTop: 3.5,
    paddingHorizontal: spacing.screenX,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  section: {
    gap: 12,
  },
  fullBleed: {
    marginHorizontal: -spacing.screenX,
  },
  pressed: {
    opacity: 0.85,
  },

  accountCard: {
    gap: 10,
    padding: 16 - STROKE,
  },
  accountCopy: {
    width: 240,
    gap: 4,
  },
  accountBody: {
    lineHeight: 14,
  },
  // Artwork is positioned in the card's padding box and anchored to its right edge.
  orbit: {
    position: 'absolute',
    top: 23.08,
    right: -32.94,
    width: 99.615,
    height: 41.731,
  },
  wallet: {
    position: 'absolute',
    top: -24.87,
    right: -16.66,
    width: 142.495,
    height: 106.526,
    transform: [{ rotate: '-5.98deg' }],
  },
  addButton: {
    alignSelf: 'stretch',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.pill,
    boxShadow: shadows.brandButton,
  },
  addButtonFill: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },

  locked: {
    opacity: 0.5,
  },
  setupRow: {
    overflow: 'hidden',
  },
  setupCard: {
    gap: 8,
    padding: 16 - STROKE,
  },
  setupCopy: {
    gap: 2,
  },
  setupBody: {
    lineHeight: 13,
  },
  setupAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  budgetArt: {
    position: 'absolute',
    top: -5,
    right: 0,
    width: 115,
    height: 124,
  },
  billsArtFrame: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 154,
    height: 112,
    overflow: 'hidden',
  },
  billsArt: {
    position: 'absolute',
    top: -9.016,
    left: 0,
    width: 154,
    height: 154.482,
  },

  transactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12 - STROKE,
    borderRadius: radii.lg,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMint,
  },
  transactionsTile: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.successSoft,
  },
  transactionsArtFrame: {
    position: 'absolute',
    left: 5,
    top: 4,
    width: 31,
    height: 32,
    overflow: 'hidden',
  },
  transactionsArt: {
    position: 'absolute',
    left: -14,
    top: -10.131,
    width: 58,
    height: 51.261,
  },
  transactionsCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  transactionsTitle: {
    lineHeight: 19,
  },
  transactionsBody: {
    lineHeight: 16,
  },
});
