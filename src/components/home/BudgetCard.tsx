import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, CircularProgress } from '@/components/ui';
import type { Budget } from '@/data/types';
import { radii } from '@/theme';
import { formatCurrency, ratio } from '@/utils/format';

type Props = {
  budget: Budget;
  onPress?: () => void;
};

export function BudgetCard({ budget, onPress }: Props) {
  const { category, spent, limit } = budget;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category}, ${formatCurrency(spent)} of ${formatCurrency(limit)} spent`}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card radius={radii.xl} style={styles.card}>
        <View style={styles.info}>
          <AppText variant="labelSemibold" numberOfLines={1} style={styles.center}>
            {category}
          </AppText>
          <AppText variant="nano" color="textSecondary" numberOfLines={1} style={styles.center}>
            <AppText variant="microMedium">{formatCurrency(spent)}</AppText>
            {` of ${formatCurrency(limit)}`}
          </AppText>
        </View>
        <CircularProgress progress={ratio(spent, limit)} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    width: 97,
    padding: 8,
    gap: 6,
    alignItems: 'center',
  },
  info: {
    width: '100%',
    gap: 1,
  },
  center: {
    textAlign: 'center',
  },
});
