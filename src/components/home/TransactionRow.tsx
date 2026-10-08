import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Icon } from '@/components/ui';
import type { Transaction } from '@/data/types';
import { colors, radii } from '@/theme';
import { formatCurrency } from '@/utils/format';

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export function TransactionRow({ transaction, onPress }: Props) {
  const { title, dateLabel, amount, icon, tone } = transaction;
  const amountLabel = formatCurrency(amount, { decimals: 2, signed: true });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${dateLabel}, ${amountLabel}`}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card radius={radii.lg} style={styles.row}>
        <View style={[styles.tile, { backgroundColor: tone === 'success' ? colors.successSoft : colors.dangerSoft }]}>
          {icon.type === 'icon' ? (
            <Icon name={icon.name} />
          ) : (
            // Artwork intentionally bleeds past the 40pt tile, centred on it.
            <Image source={icon.source} contentFit="cover" style={styles.artwork} />
          )}
        </View>
        <View style={styles.info}>
          <AppText variant="titleSm" numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {dateLabel}
          </AppText>
        </View>
        <AppText variant="amountRow" color={amount >= 0 ? 'success' : 'danger'}>
          {amountLabel}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artwork: {
    position: 'absolute',
    width: 58,
    height: 51,
    left: -9,
    top: -5.5,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
