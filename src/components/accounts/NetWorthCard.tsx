import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { formatCurrency } from '@/utils/format';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  amount: number;
};

/** "Total Net Worth" summary at the top of the Accounts page. */
export function NetWorthCard({ amount }: Props) {
  const label = formatCurrency(amount, { decimals: 2 });
  return (
    <Card
      radius={24}
      shadow="cardRaised"
      accessible
      accessibilityLabel={`Total net worth, ${label}`}
      style={styles.card}
      backdrop={<Image source={require('@/assets/images/net-worth-chart.png')} contentFit="fill" style={styles.chart} />}>
      {/* Row keeps the height of Figma's "this month" badge, which needs history the app doesn't have yet. */}
      <View style={styles.header}>
        <AppText variant="overlineMd" color="textSecondary">
          Total Net Worth
        </AppText>
      </View>
      <AppText variant="amountHero" numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20 - STROKE,
  },
  header: {
    minHeight: 22,
    justifyContent: 'center',
  },
  // Anchored to the card's right edge (padding box), as in Figma.
  chart: {
    position: 'absolute',
    top: -46,
    right: -41,
    width: 235,
    height: 208,
    opacity: 0.2,
  },
});
