import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText, AvatarStack, Card, CollectedAmount, ProgressBar } from '@/components/ui';
import type { SharedDebt } from '@/data/types';
import { radii } from '@/theme';
import { formatCurrency, ratio } from '@/utils/format';

type Props = {
  debt: SharedDebt;
  onPress?: () => void;
  /** Card width in points; defaults to the dashboard carousel's 280. */
  width?: number;
  style?: StyleProp<ViewStyle>;
};

export function DebtCard({ debt, onPress, width = 280, style }: Props) {
  const { title, collected, total, participants } = debt;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${formatCurrency(collected)} of ${formatCurrency(total)} collected`}
      onPress={onPress}
      style={({ pressed }) => [style, pressed && styles.pressed]}>
      <Card radius={radii.xxl} style={[styles.card, { width }]}>
        <View style={styles.top}>
          <View style={styles.details}>
            <AppText variant="titleMd" numberOfLines={1}>
              {title}
            </AppText>
            <CollectedAmount collected={collected} total={total} />
          </View>
          <AvatarStack people={participants} />
        </View>
        <ProgressBar progress={ratio(collected, total)} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    padding: 16,
    gap: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  details: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
