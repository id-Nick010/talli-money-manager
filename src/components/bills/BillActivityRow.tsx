import { StyleSheet, View } from 'react-native';

import { AppText, Avatar } from '@/components/ui';
import type { BillActivity } from '@/data/types';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/format';

type Props = {
  activity: BillActivity;
};

/** "Sep 15, 2026 · 10:24 AM" */
const formatDate = (date: Date) =>
  `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

/** "Daphne paid · Sep 15, 2026 · 10:24 AM · +₱5,000.00" row in a bill's transaction history. */
export function BillActivityRow({ activity }: Props) {
  const { person, action, date, amount } = activity;
  const label = `${person.name} ${action}`;
  const value = formatCurrency(amount, { decimals: 2, signed: true });
  const dateLabel = formatDate(date);

  return (
    <View accessible accessibilityLabel={`${label} ${value} on ${dateLabel}`} style={styles.row}>
      <View style={styles.left}>
        <Avatar {...person} />
        <View style={styles.meta}>
          <AppText variant="rowTitle" numberOfLines={1} style={styles.title}>
            {label}
          </AppText>
          <AppText variant="statusLabel" color="textSecondary" style={styles.date}>
            {dateLabel}
          </AppText>
        </View>
      </View>
      <AppText variant="rowAmount">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    // Figma's 12pt padding excludes the 1pt divider, so the bottom gives it back.
    paddingTop: 12,
    paddingBottom: 12 - 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.track,
  },
  left: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    flexShrink: 1,
    gap: 2,
  },
  title: {
    lineHeight: 17,
  },
  date: {
    lineHeight: 15,
  },
});
