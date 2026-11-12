import { router, useScrollToTop } from 'expo-router';
import { useRef, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountListCard, NetWorthCard } from '@/components/accounts';
import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { AppText, IconButton, ScreenHeader } from '@/components/ui';
import { useAccounts } from '@/data/accountsStore';
import type { Account } from '@/data/types';

/** The Accounts page uses a wider gutter than the other tabs. */
const GUTTER = 24;

/** Which section of the page an account belongs to, from the category picked in Add Account. */
function sectionOf(account: Account): 'cash' | 'investments' | 'credit' {
  if (account.typeId === 'investments') return 'investments';
  if (account.typeId === 'credit-card') return 'credit';
  return 'cash';
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="sectionTitleLg" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

export function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const accounts = useAccounts();
  const defaultId = accounts[0]?.id;
  const cash = accounts.filter((account) => sectionOf(account) === 'cash');
  const investments = accounts.filter((account) => sectionOf(account) === 'investments');
  const credit = accounts.filter((account) => sectionOf(account) === 'credit');
  // Credit card balances are money owed, so they count against net worth.
  const netWorth = accounts.reduce(
    (sum, account) => sum + (sectionOf(account) === 'credit' ? -account.balance : account.balance),
    0,
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarInset + 24 }}>
        <ScreenHeader
          title="Accounts"
          actions={
            <IconButton icon="add" accessibilityLabel="Add account" onPress={() => router.push('/add-account')} />
          }
        />

        <View style={styles.content}>
          <NetWorthCard amount={netWorth} />

          {cash.length > 0 ? (
            <Section title="My Accounts">
              <View style={styles.cashList}>
                {cash.map((account) => (
                  <AccountListCard key={account.id} account={account} variant="cash" isDefault={account.id === defaultId} />
                ))}
              </View>
            </Section>
          ) : null}

          {investments.length > 0 ? (
            <Section title="Investments & Assets">
              <View style={styles.assetList}>
                {investments.map((account) => (
                  <AccountListCard key={account.id} account={account} variant="asset" isDefault={account.id === defaultId} />
                ))}
              </View>
            </Section>
          ) : null}

          {credit.length > 0 ? (
            <Section title="Credit Cards">
              <View style={styles.assetList}>
                {credit.map((account) => (
                  <AccountListCard key={account.id} account={account} variant="asset" isDefault={account.id === defaultId} />
                ))}
              </View>
            </Section>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma: each section has 8pt above and 16pt below, so 24pt separates them.
  content: {
    gap: 24,
    paddingTop: 8,
    paddingHorizontal: GUTTER,
  },
  section: {
    gap: 12,
  },
  cashList: {
    gap: 10,
  },
  assetList: {
    gap: 12,
  },
});
