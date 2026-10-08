import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Icon } from '@/components/ui';
import type { Account } from '@/data/types';
import { radii } from '@/theme';
import { formatCurrency } from '@/utils/format';

type Props = {
  account: Account;
  onPress?: () => void;
};

export function AccountCard({ account, onPress }: Props) {
  const { name, balance, last4, description, artwork } = account;
  const detail = last4 ? `**** ${last4}` : (description ?? '');
  const balanceLabel = `${name}, balance ${formatCurrency(balance, { decimals: 2 })}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={last4 ? `${balanceLabel}, card ending ${last4}` : detail ? `${balanceLabel}, ${detail}` : balanceLabel}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card
        radius={radii.xxl}
        shadow={artwork ? 'cardRaised' : 'card'}
        style={styles.card}
        backdrop={artwork ? <Image source={artwork} contentFit="cover" style={styles.artwork} /> : undefined}>
        <View style={styles.top}>
          <AppText variant="overline" color="textSecondary" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="amountLg" numberOfLines={1}>
            {formatCurrency(balance, { decimals: 2 })}
          </AppText>
        </View>
        <View style={styles.bottom}>
          <AppText variant="micro" color="textSecondary" numberOfLines={1} style={styles.detail}>
            {detail}
          </AppText>
          {artwork ? null : <Icon name="walletCards" />}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    width: 220,
    height: 96,
    padding: 14,
    justifyContent: 'space-between',
  },
  artwork: {
    position: 'absolute',
    left: 74,
    top: -1,
    width: 159,
    height: 106,
  },
  top: {
    gap: 2,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  detail: {
    flexShrink: 1,
  },
});
