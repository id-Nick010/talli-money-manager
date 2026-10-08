import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import type { IllustratedOption } from '@/data/categories';
import { colors, typography } from '@/theme';
import { CURRENCY_SYMBOL, formatAmountInput } from '@/utils/format';

import { BudgetCategoryIcon } from './BudgetCategoryIcon';

/** Figma keeps 1pt strokes out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  category: IllustratedOption;
  value: string;
  onChange: (value: string) => void;
};

/** A chosen budget category with its monthly-limit field. */
export function BudgetLimitRow({ category, value, onChange }: Props) {
  const { label } = category;

  return (
    <Card shadow="cardRaised" style={styles.row}>
      <BudgetCategoryIcon artwork={category.artwork} />

      <AppText variant="labelSemiboldMd" numberOfLines={1} style={styles.name}>
        {label}
      </AppText>

      <View style={styles.input}>
        <AppText variant="inputLg" color="textSecondary" style={styles.currency}>
          {CURRENCY_SYMBOL}
        </AppText>
        <TextInput
          value={value}
          onChangeText={(text) => onChange(formatAmountInput(text))}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          selectionColor={colors.brand}
          cursorColor={colors.brand}
          accessibilityLabel={`${label} monthly limit`}
          style={[styles.amount, typography.amountInputSm]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12 - STROKE,
  },
  name: {
    flex: 1,
    minWidth: 0,
    lineHeight: 18,
  },
  input: {
    width: 88,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10 - STROKE,
    borderRadius: 10,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  currency: {
    lineHeight: 19,
  },
  amount: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    textAlign: 'right',
    color: colors.textPrimary,
  },
});
