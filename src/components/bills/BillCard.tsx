import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, AvatarStack, Card, CollectedAmount, ProgressBar } from '@/components/ui';
import type { SharedDebt } from '@/data/types';
import { colors, radii } from '@/theme';
import { formatCurrency, ratio } from '@/utils/format';

export function isSettled(bill: SharedDebt) {
  return bill.total > 0 && bill.collected >= bill.total;
}

type Props = {
  bill: SharedDebt;
  onPress?: () => void;
};

export function BillCard({ bill, onPress }: Props) {
  const { title, emoji, collected, total, participants } = bill;
  const progress = ratio(collected, total);
  const percent = `${Math.round(progress * 100)}%`;
  const settled = isSettled(bill);
  const status = settled ? 'Settled' : 'In Progress';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${status}, ${formatCurrency(collected)} of ${formatCurrency(total)} collected`}
      onPress={onPress}
      style={({ pressed }) => [settled && styles.settled, pressed && styles.pressed]}>
      <Card radius={radii.xxl} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.identity}>
            <View style={styles.tile}>
              <AppText variant="emoji">{emoji ?? '🧾'}</AppText>
            </View>
            <View style={styles.names}>
              <AppText variant="cardTitle" numberOfLines={1}>
                {title}
              </AppText>
              <AppText variant="statusLabel" color="success">
                {status}
              </AppText>
            </View>
          </View>
          <AvatarStack people={participants} />
        </View>

        <View style={styles.amounts}>
          <CollectedAmount collected={collected} total={total} size="md" />
          <AppText variant="amountSm" color="success">
            {percent}
          </AppText>
        </View>

        <ProgressBar progress={progress} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  settled: {
    opacity: 0.72,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  identity: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  names: {
    flexShrink: 1,
    gap: 2,
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});
