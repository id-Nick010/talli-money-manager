import { router, useScrollToTop } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BillCard, isSettled } from '@/components/bills';
import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { IconButton, ScreenHeader, SectionHeader, StatCard } from '@/components/ui';
import { useBills, useBillsSummary } from '@/data/billsStore';
import { spacing } from '@/theme';

const openBill = (id: string) => router.push({ pathname: '/bills/[id]', params: { id } });

export function BillsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const scrollRef = useRef<ScrollView>(null);
  // Tapping the Bills tab while already on it scrolls back to the top.
  useScrollToTop(scrollRef);

  const bills = useBills();
  const billsSummary = useBillsSummary();
  const active = bills.filter((bill) => !isSettled(bill));
  const settled = bills.filter(isSettled);

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarInset + 24 }}>
        <ScreenHeader
          title="Shared Bills"
          actions={
            <IconButton icon="add" accessibilityLabel="New shared bill" onPress={() => router.push('/add-bill')} />
          }
        />

        <View style={styles.sections}>
          <View style={[styles.gutter, styles.summary]}>
            <StatCard size="regular" label="Bills owed to you" amount={billsSummary.owedToYou} decimals={2} />
            <StatCard size="regular" label="Bills you owe" amount={billsSummary.youOwe} decimals={2} />
          </View>

          <View style={styles.section}>
            <View style={styles.gutter}>
              <SectionHeader title="Active Bills" meta={`${active.length} In progress`} metaColor="success" />
            </View>

            <View style={[styles.gutter, styles.groups]}>
              <View style={styles.list}>
                {active.map((bill) => (
                  <BillCard key={bill.id} bill={bill} onPress={() => openBill(bill.id)} />
                ))}
              </View>

              {settled.length > 0 ? (
                <View style={styles.section}>
                  <SectionHeader title="Settled" meta={`${settled.length} completed`} metaColor="textMuted" />
                  <View style={styles.list}>
                    {settled.map((bill) => (
                      <BillCard key={bill.id} bill={bill} onPress={() => openBill(bill.id)} />
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
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
  summary: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    gap: 12,
  },
  groups: {
    gap: 20,
  },
  list: {
    gap: 12,
  },
});
