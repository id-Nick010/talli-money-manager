import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppText, BottomSheet, BrandGradient, CategoryTile, Icon, SheetButton } from '@/components/ui';
import { budgetCategories } from '@/data/categories';
import { radii } from '@/theme';
import { parseAmount } from '@/utils/format';

import { BudgetLimitRow } from './BudgetLimitRow';

/** The save button's Figma gradient (≈174°) in the button's own bounding box. */
const SAVE_GRADIENT_VECTOR = { x1: 0.4865, y1: -0.3698, x2: 0.5135, y2: 1.3698 } as const;

/** Room for the limit cards' shadows inside the scroll view; offset with negative margins. */
const SHADOW_BLEED = 16;

export type BudgetDraft = { categoryId: string; limit: number };

type Props = {
  /** Called once the dismiss animation finishes. Keep it referentially stable. */
  onClose: () => void;
  onSubmit: (budgets: BudgetDraft[]) => void;
};

function pickLabel(count: number) {
  if (count === 0) return 'Add Budget Categories';
  return `Add ${count} Budget ${count === 1 ? 'Category' : 'Categories'}`;
}

/** Two-step budget setup: pick spending categories, then give each a monthly limit. */
export function BudgetSetupSheet({ onClose, onSubmit }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const [step, setStep] = useState<'categories' | 'limits'>('categories');
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  // Kept when going back, so limits survive changing the selection.
  const [limits, setLimits] = useState<Record<string, string>>({});

  const chosen = budgetCategories.filter((category) => selected.has(category.id));
  const allLimitsSet = chosen.length > 0 && chosen.every((category) => parseAmount(limits[category.id] ?? '') > 0);

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const save = (close: () => void) => {
    if (!allLimitsSet) return;
    onSubmit(chosen.map((category) => ({ categoryId: category.id, limit: parseAmount(limits[category.id]) })));
    close();
  };

  if (step === 'categories') {
    return (
      <BottomSheet title="Monthly Budgets" onClose={onClose}>
        {() => (
          <>
            <View style={styles.field}>
              <AppText variant="fieldLabel" color="textSecondary" style={styles.fieldLabel}>
                Select Category
              </AppText>
              <View style={styles.grid}>
                {budgetCategories.map((category) => (
                  <CategoryTile
                    key={category.id}
                    mode="checkbox"
                    label={category.label}
                    artwork={category.artwork}
                    selected={selected.has(category.id)}
                    onPress={() => toggle(category.id)}
                  />
                ))}
              </View>
            </View>

            <SheetButton
              label={pickLabel(selected.size)}
              disabled={selected.size === 0}
              onPress={() => setStep('limits')}
            />
          </>
        )}
      </BottomSheet>
    );
  }

  const count = chosen.length;
  return (
    <BottomSheet title="Add Monthly Budgets" onClose={onClose} onBack={() => setStep('categories')} closePadding={6}>
      {(close) => (
        <>
          <View style={styles.amounts}>
            <View style={styles.headings}>
              <AppText variant="rowTitle" style={styles.countLabel}>
                {`${count} ${count === 1 ? 'category' : 'categories'}`}
              </AppText>
              <AppText variant="captionSm" color="textSecondary" style={styles.limitLabel}>
                Monthly limit
              </AppText>
            </View>
            <ScrollView
              style={[styles.scroll, { maxHeight: windowHeight * 0.45 + SHADOW_BLEED }]}
              contentContainerStyle={styles.rows}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {chosen.map((category) => (
                <BudgetLimitRow
                  key={category.id}
                  category={category}
                  value={limits[category.id] ?? ''}
                  onChange={(value) => setLimits((current) => ({ ...current, [category.id]: value }))}
                />
              ))}
            </ScrollView>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !allLimitsSet }}
            accessibilityHint={allLimitsSet ? undefined : 'Enter a monthly limit for every category first'}
            disabled={!allLimitsSet}
            onPress={() => save(close)}
            style={({ pressed }) => [styles.save, !allLimitsSet && styles.saveDisabled, pressed && styles.savePressed]}>
            <View style={styles.saveFill}>
              <BrandGradient vector={SAVE_GRADIENT_VECTOR} />
            </View>
            <AppText variant="titleMd" color="white" style={styles.saveLabel}>
              {`Save ${count} ${count === 1 ? 'budget' : 'budgets'}`}
            </AppText>
            <Icon name="checkMd" />
          </Pressable>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  fieldLabel: {
    lineHeight: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 10,
    rowGap: 6,
  },

  amounts: {
    gap: 8,
  },
  headings: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  countLabel: {
    lineHeight: 17,
  },
  limitLabel: {
    lineHeight: 15,
  },
  scroll: {
    flexGrow: 0,
    marginHorizontal: -SHADOW_BLEED,
    marginBottom: -SHADOW_BLEED,
  },
  rows: {
    gap: 8,
    paddingHorizontal: SHADOW_BLEED,
    paddingBottom: SHADOW_BLEED,
  },

  save: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.lg,
  },
  saveFill: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  saveLabel: {
    lineHeight: 20,
  },
  saveDisabled: {
    opacity: 0.5,
  },
  savePressed: {
    transform: [{ scale: 0.98 }],
  },
});
