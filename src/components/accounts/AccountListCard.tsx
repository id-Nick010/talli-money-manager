import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import type { Account } from '@/data/types';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/format';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  account: Account;
  /**
   * `cash` for everyday accounts (bordered, wallet artwork); `asset` for investments and credit
   * cards (borderless, growth artwork, plain-figure balance).
   */
  variant: 'cash' | 'asset';
  isDefault?: boolean;
  onPress?: () => void;
};

/** Full-width account card on the Accounts page. */
export function AccountListCard({ account, variant, isDefault, onPress }: Props) {
  const { name, balance } = account;
  const balanceLabel = formatCurrency(balance, { decimals: 2 });
  const cash = variant === 'cash';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, balance ${balanceLabel}${isDefault ? ', default account' : ''}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card
        radius={20}
        shadow="cardRaised"
        style={cash ? styles.cashCard : styles.assetCard}
        backdrop={
          cash ? (
            <View style={styles.walletFrame}>
              <Image source={require('@/assets/images/account-card-wallet.png')} contentFit="fill" style={styles.wallet} />
            </View>
          ) : (
            <Image source={require('@/assets/images/account-growth.png')} contentFit="fill" style={styles.growth} />
          )
        }>
        <View style={[styles.topRow, cash && styles.topRowCash]}>
          <AppText variant="overlineMd" color="textSecondary" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
          {isDefault ? (
            <View style={styles.badge}>
              <AppText variant="badge" color="brand">
                Default
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant={cash ? 'amountCard' : 'amountCardPlain'} numberOfLines={1} adjustsFontSizeToFit>
          {balanceLabel}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  cashCard: {
    padding: 16 - STROKE,
  },
  // Investment and credit card cards have no stroke in Figma.
  assetCard: {
    gap: 4,
    padding: 16,
    borderWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topRowCash: {
    minHeight: 23,
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.successTint,
  },
  // Artwork is anchored to the card's right edge, in its padding box, as in Figma.
  walletFrame: {
    position: 'absolute',
    top: -8,
    right: -17,
    width: 134,
    height: 125,
    overflow: 'hidden',
    opacity: 0.7,
  },
  wallet: {
    position: 'absolute',
    top: 0,
    left: -54.83,
    width: 189.06,
    height: 125,
  },
  growth: {
    position: 'absolute',
    top: -10,
    right: -19.08,
    width: 172.08,
    height: 152,
    opacity: 0.5,
  },
});
