import { StyleSheet, View } from 'react-native';

import { radii } from '@/theme';
import { formatCurrency } from '@/utils/format';

import { AppText } from './AppText';
import { Card } from './Card';

type Props = {
  label: string;
  amount: number;
  /** Fraction digits; defaults to whole numbers when the amount has none. */
  decimals?: number;
  /** `compact` for three-up rows, `regular` for two-up rows, `dense` for the empty-state summary row. */
  size?: 'compact' | 'regular' | 'dense';
};

export function StatCard({ label, amount, decimals, size = 'compact' }: Props) {
  const regular = size === 'regular';
  const dense = size === 'dense';
  return (
    <Card
      radius={regular ? radii.xl : radii.lg}
      shadow={dense ? 'cardSoft' : 'card'}
      style={[styles.card, styles[size]]}>
      <View style={regular ? undefined : styles.compactContent}>
        <AppText variant={dense ? 'overlineXs' : 'overlineSm'} color="textSecondary" numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="amountMd" numberOfLines={1} adjustsFontSizeToFit style={dense && styles.denseAmount}>
          {formatCurrency(amount, { decimals })}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
  },
  compact: {
    padding: 12,
  },
  regular: {
    padding: 14,
  },
  // Figma's dense card keeps its 1pt stroke out of the padding.
  dense: {
    height: 62,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  denseAmount: {
    lineHeight: 22,
  },
  compactContent: {
    gap: 2,
  },
});
