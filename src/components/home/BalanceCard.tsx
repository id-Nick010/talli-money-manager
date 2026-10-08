import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import type { Account } from '@/data/types';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/format';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;
const CARD_HEIGHT = 88;

type Props = {
  account: Account;
  /** The account new transactions go to by default; shows the badge and wallet artwork. */
  isDefault?: boolean;
  onPress?: () => void;
};

/** Account card in the getting-started home's accounts row. */
export function BalanceCard({ account, isDefault, onPress }: Props) {
  const { name, balance } = account;
  const balanceLabel = formatCurrency(balance, { decimals: 2 });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, balance ${balanceLabel}${isDefault ? ', default account' : ''}`}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card
        radius={20}
        shadow="cardRaised"
        style={styles.card}
        backdrop={
          isDefault ? (
            <Image source={require('@/assets/images/account-card-wallet.png')} contentFit="cover" style={styles.wallet} />
          ) : undefined
        }>
        <View style={[styles.top, isDefault && styles.topBesideArt]}>
          <AppText variant="overline" color="textSecondary" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
          <AppText variant="amountLg" numberOfLines={1} adjustsFontSizeToFit style={styles.balance}>
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
    height: CARD_HEIGHT,
    justifyContent: 'center',
    padding: 14 - STROKE,
  },
  top: {
    gap: 2,
  },
  // Keeps long names and balances clear of the wallet artwork and badge.
  topBesideArt: {
    marginRight: 64,
  },
  name: {
    lineHeight: 15,
  },
  balance: {
    lineHeight: 24,
  },
  // Artwork and badge are positioned in the card's padding box, as in Figma.
  wallet: {
    position: 'absolute',
    left: 63,
    top: -7,
    width: 175,
    height: 116,
  },
  badge: {
    position: 'absolute',
    left: 148,
    top: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.successTint,
  },
});
