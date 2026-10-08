import { router, useScrollToTop } from 'expo-router';
import { useRef, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountCard, BudgetCard, DebtCard, HomeEmptyState, MonthHeader, TransactionRow } from '@/components/home';
import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { HorizontalList, SectionHeader, StatCard } from '@/components/ui';
import { useAccounts } from '@/data/accountsStore';
import { useBills } from '@/data/billsStore';
import { useBudgets } from '@/data/budgetsStore';
import { isSettled } from '@/components/bills';
import { currentMonth, monthlySummary, recentTransactions } from '@/data/mock';
import { spacing } from '@/theme';

type SectionProps = { title: string; gap: number; onPress?: () => void; children: ReactNode };

function Section({ title, gap, onPress = () => {}, children }: SectionProps) {
  return (
    <View style={{ gap }}>
      <View style={styles.gutter}>
        <SectionHeader title={title} onPress={onPress} />
      </View>
      {children}
    </View>
  );
}

const openAccounts = () => router.navigate('/accounts');

/** Opens a bill's detail page inside the Bills tab. */
const openBill = (id: string) => router.navigate({ pathname: '/bills/[id]', params: { id } });

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const accounts = useAccounts();
  const budgets = useBudgets();
  const bills = useBills();
  const { income, expenses } = monthlySummary;
  // Until the user has transactions, home keeps the getting-started layout (which also covers
  // brand-new users without an account, and shows any budgets and bills they've set up).
  const isGettingStarted = accounts.length === 0 || recentTransactions.length === 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarInset + 24 }}>
        <MonthHeader month={currentMonth} hasUnreadReminders />

        {isGettingStarted ? (
          <HomeEmptyState
            summary={monthlySummary}
            accounts={accounts}
            budgets={budgets}
            bills={bills}
            onAddAccount={() => router.push('/add-account')}
            onOpenAccounts={openAccounts}
            onSetUpBudget={() => router.push('/budget-setup')}
            onOpenBudgets={() => router.push('/budgets')}
            onSplitBills={() => router.push('/add-bill')}
            // The Bills tab unlocks once there's a bill to show.
            onOpenBills={bills.length > 0 ? () => router.navigate('/bills') : undefined}
            onOpenBill={openBill}
          />
        ) : (
          <View style={styles.sections}>
            <View style={[styles.gutter, styles.stats]}>
              <StatCard label="Total Income" amount={income} />
              <StatCard label="Total Expenses" amount={expenses} />
              <StatCard label="Net Savings" amount={income - expenses} />
            </View>

            <Section title="My Accounts" gap={12} onPress={openAccounts}>
              <HorizontalList>
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </HorizontalList>
            </Section>

            <Section title="Monthly Budgets" gap={12} onPress={() => router.push('/budgets')}>
              <HorizontalList>
                {budgets.map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))}
              </HorizontalList>
            </Section>

            <View style={styles.lists}>
              <Section title="Shared Debts" gap={14} onPress={() => router.navigate('/bills')}>
                <HorizontalList>
                  {bills.filter((bill) => !isSettled(bill)).map((bill) => (
                    <DebtCard key={bill.id} debt={bill} onPress={() => openBill(bill.id)} />
                  ))}
                </HorizontalList>
              </Section>

              <Section title="Recent Transactions" gap={14}>
                <View style={[styles.gutter, styles.transactions]}>
                  {recentTransactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </View>
              </Section>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gutter: {
    paddingHorizontal: spacing.screenX,
  },
  sections: {
    gap: 18,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  lists: {
    gap: 22,
  },
  transactions: {
    gap: 8,
  },
});
