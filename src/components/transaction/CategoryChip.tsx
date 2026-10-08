import { Pressable, StyleSheet } from 'react-native';

import { AppText, FillMask, Icon } from '@/components/ui';
import type { TransactionCategory } from '@/data/categories';
import { colors, radii, type TypographyVariant } from '@/theme';

type Props = {
  category: TransactionCategory;
  selected: boolean;
  onPress: () => void;
  labelVariant?: TypographyVariant;
  /** Figma's horizontal padding for the chip (the 2pt border is drawn inside it). */
  paddingX?: number;
};

export function CategoryChip({ category, selected, onPress, labelVariant = 'labelSemibold', paddingX = 10 }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={category.label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, { paddingHorizontal: paddingX - 2 }, selected && styles.chipSelected, pressed && styles.pressed]}>
      <FillMask fill={selected ? colors.brand : colors.textSecondary}>
        <Icon name={category.icon} />
      </FillMask>
      <AppText variant={labelVariant} color={selected ? 'brand' : 'textSecondary'}>
        {category.label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // Figma draws the selected chip's 2pt stroke inside the 10×6 padding, so every chip keeps
    // the same outer size: 2pt (transparent) border + 8×4 padding.
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radii.pill,
    backgroundColor: colors.track,
  },
  chipSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  pressed: {
    opacity: 0.8,
  },
});
