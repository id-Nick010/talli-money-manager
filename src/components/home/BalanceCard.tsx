import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import type { Account } from '@/data/types';
import { colors, radii } from '@/theme';
import { formatCurrency } from '@/utils/format';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;
const PADDING = 14;
/** Where Figma puts the "Default" badge, from the card's outer edge. */
const BADGE_LEFT = 148;

type Props = {
  account: Account;
  /** The account new transactions go to by default; shows the "Default" badge. */
  isDefault?: boolean;
  onPress?: () => void;
};

/** Account card in Home's "My Accounts" row: name, balance and the wallet artwork. */
export function BalanceCard({ account, isDefault, onPress }: Props) {
  const { name, balance } = account;
  const balanceLabel = formatCurrency(balance, { decimals: 2 });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, balance ${balanceLabel}${isDefault ? ', default account' : ''}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card
        radius={radii.xxl}
        shadow="cardRaised"
        style={styles.card}
        backdrop={
          <Image source={require('@/assets/images/account-card-wallet.png')} contentFit="cover" style={styles.wallet} />
        }>
        <View style={styles.top}>
          <AppText variant="overline" color="textSecondary" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="amountLg" numberOfLines={1} adjustsFontSizeToFit>
            {balanceLabel}
          </AppText>
        </View>
        {isDefault ? (
          <View style={styles.badge}>
            <AppText variant="badge" color="brand">
              Default
            </AppText>
          </View>
        ) : null}
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
    padding: PADDING - STROKE,
  },
  top: {
    gap: 2,
    // Keeps long names and balances clear of the badge.
    maxWidth: BADGE_LEFT - PADDING * 2,
  },
  // Artwork and badge sit inside the border, so Figma's offsets lose the 1pt stroke.
  wallet: {
    position: 'absolute',
    left: 84 - STROKE,
    top: -6 - STROKE,
    width: 145,
    height: 96,
  },
  badge: {
    position: 'absolute',
    left: BADGE_LEFT - STROKE,
    top: 13 - STROKE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.successTint,
  },
});
