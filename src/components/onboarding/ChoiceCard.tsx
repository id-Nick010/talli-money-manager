import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Icon, type IconName } from '@/components/ui';
import { colors, radii, typography } from '@/theme';

/** Figma keeps strokes out of the 15pt padding; React Native pads inside the border. */
const PADDING = 15;
const STROKE = 1;
const STROKE_SELECTED = 1.5;

type Props = {
  /** The 40pt tile on the left: `FeatureSymbol` or `FlagSymbol`. */
  symbol: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

/** One radio card in the onboarding choice lists (features, currencies). */
export function ChoiceCard({ symbol, title, description, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}, ${description}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}>
      {symbol}
      <View style={styles.copy}>
        <AppText variant="choiceTitle">{title}</AppText>
        <AppText variant="onboardingNote" color="textSecondary">
          {description}
        </AppText>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <Icon name="onboardingCheck" /> : null}
      </View>
    </Pressable>
  );
}

/** Mint tile with a line icon — "Where would you like to start?" */
export function FeatureSymbol({ icon }: { icon: IconName }) {
  return (
    <View style={[styles.symbol, styles.featureSymbol]}>
      <Icon name={icon} />
    </View>
  );
}

/** Green tile with a flag emoji — currency list. */
export function FlagSymbol({ flag }: { flag: string }) {
  return (
    <View style={[styles.symbol, styles.flagSymbol]}>
      <AppText style={styles.flag}>{flag}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: PADDING - STROKE,
    borderRadius: radii.xxl,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardSelected: {
    padding: PADDING - STROKE_SELECTED,
    borderWidth: STROKE_SELECTED,
    borderColor: colors.brand,
    backgroundColor: colors.surfaceMint,
  },
  pressed: {
    opacity: 0.85,
  },
  symbol: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureSymbol: {
    borderRadius: radii.md,
    backgroundColor: colors.successTint,
  },
  flagSymbol: {
    borderRadius: 10,
    backgroundColor: colors.successSoft,
  },
  flag: {
    ...typography.emoji,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: STROKE,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  radioSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
});
