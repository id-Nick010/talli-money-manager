import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { budgetCategories } from '@/data/categories';
import type { Budget } from '@/data/types';
import { colors } from '@/theme';
import { formatCurrency, ratio } from '@/utils/format';

import { BudgetCategoryIcon } from './BudgetCategoryIcon';

/** Figma keeps 1pt strokes out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  budget: Budget;
};

/** A saved monthly budget with its spending progress. */
export function SavedBudgetRow({ budget }: Props) {
  const { category, categoryId, spent, limit } = budget;
  const artwork = budgetCategories.find((option) => option.id === categoryId)?.artwork;
  const spending = `${formatCurrency(spent)} of ${formatCurrency(limit)} spent`;

  return (
    <View accessible accessibilityLabel={`${category}, ${spending}`} style={styles.row}>
      <BudgetCategoryIcon artwork={artwork} />
      <View style={styles.details}>
        <AppText variant="labelSemiboldMd" numberOfLines={1} style={styles.name}>
          {category}
        </AppText>
        <View style={styles.progress}>
          <ProgressBar progress={ratio(spent, limit)} trackColor={colors.ringTrack} minFill={1} />
          <AppText variant="micro" color="textSecondary" numberOfLines={1} style={styles.spending}>
            {spending}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14 - STROKE,
    paddingVertical: 10 - STROKE,
    borderRadius: 20,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  details: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  name: {
    lineHeight: 18,
  },
  progress: {
    gap: 2,
  },
  spending: {
    lineHeight: 14,
  },
});
