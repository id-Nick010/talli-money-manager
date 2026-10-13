import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, ArtworkFrame, Card, Icon } from '@/components/ui';
import type { Transaction } from '@/data/types';
import { colors, radii } from '@/theme';
import { formatDateLabel } from '@/utils/date';
import { formatCurrency } from '@/utils/format';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

/** "Spotify Premium · Today @ Main Account · -₱229" row in Recent Transactions. */
export function TransactionRow({ transaction, onPress }: Props) {
  const { title, date, accountName, amount, icon } = transaction;
  const amountLabel = formatCurrency(amount, { signed: true, trim: true });
  const when = formatDateLabel(date);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${when} at ${accountName}, ${amountLabel}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card radius={radii.lg} style={styles.row}>
        <View style={styles.tile}>
          {icon.type === 'icon' ? <Icon name={icon.name} /> : null}
          {icon.type === 'tile' ? <ArtworkFrame artwork={icon.artwork} /> : null}
          {icon.type === 'artwork' ? (
            // Artwork intentionally bleeds past the 40pt tile, centred on it.
            <Image source={icon.source} contentFit="cover" style={styles.artwork} />
          ) : null}
        </View>
        <View style={styles.info}>
          <AppText variant="titleSm" numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {`${when} @ ${accountName}`}
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
    padding: 12 - STROKE,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successSoft,
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
