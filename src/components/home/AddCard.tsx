import { Pressable, StyleSheet } from 'react-native';

import { Card, Icon } from '@/components/ui';

type Props = {
  /** Screen-reader label, e.g. "Add account". */
  label: string;
  onPress?: () => void;
};

/** The "+" card at the end of a home carousel; stretches to the height of the cards beside it. */
export function AddCard({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}>
      <Card radius={20} shadow="cardRaised" style={styles.card}>
        <Icon name="plusLg" />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Carousels align cards to the top, so the + card opts in to matching its neighbours' height.
  wrapper: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    flex: 1,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
