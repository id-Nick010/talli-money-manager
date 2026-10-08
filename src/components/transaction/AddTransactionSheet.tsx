import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, BottomSheet, DatePickerField, SheetButton } from '@/components/ui';
import { transactionCategories } from '@/data/categories';
import type { TransactionKind } from '@/data/types';
import { colors, typography, type TypographyVariant } from '@/theme';
import { CURRENCY_SYMBOL, formatAmountInput, parseAmount } from '@/utils/format';

import { CategoryChip } from './CategoryChip';
import { SegmentedControl } from './SegmentedControl';

export type TransactionDraft = {
  kind: TransactionKind;
  amount: number;
  description: string;
  categoryId: string;
  date: Date;
};

type Props = {
  /** Called once the dismiss animation finishes. Keep it referentially stable. */
  onClose: () => void;
  onSubmit: (draft: TransactionDraft) => void;
};

const KIND_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
] as const;

/** Copy and styling that differ between the Expense and Income designs. */
const KIND_CONFIG: Record<
  TransactionKind,
  {
    labelVariant: TypographyVariant;
    chipLabelVariant: TypographyVariant;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitLabel: string;
  }
> = {
  expense: {
    labelVariant: 'fieldLabel',
    chipLabelVariant: 'labelSemibold',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What was it for?',
    submitLabel: 'Add Transaction',
  },
  income: {
    labelVariant: 'fieldLabelSm',
    chipLabelVariant: 'labelSemiboldMd',
    descriptionLabel: 'Source Description',
    descriptionPlaceholder: 'Where is it from?',
    submitLabel: 'Add Income',
  },
};

export function AddTransactionSheet({ onClose, onSubmit }: Props) {
  const [kind, setKind] = useState<TransactionKind>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(transactionCategories.expense[0].id);
  const [date, setDate] = useState(() => new Date());
  const config = KIND_CONFIG[kind];
  const categories = transactionCategories[kind];

  const changeKind = (next: TransactionKind) => {
    if (next === kind) return;
    setKind(next);
    // Categories differ per kind; amount and description carry over.
    setCategoryId(transactionCategories[next][0].id);
  };

  const amountValue = parseAmount(amount);
  const canSubmit = amountValue > 0;

  const submit = (close: () => void) => {
    if (!canSubmit) return;
    onSubmit({ kind, amount: amountValue, description: description.trim(), categoryId, date });
    close();
  };

  return (
    <BottomSheet title="Add Transaction" onClose={onClose}>
      {(close) => (
        <>
          <SegmentedControl options={KIND_OPTIONS} value={kind} onChange={changeKind} />

          <View style={styles.field}>
            <AppText variant={config.labelVariant} color="textSecondary">
              Amount
            </AppText>
            <View style={[styles.box, styles.amountBox]}>
              <AppText variant="amountInput" color="brand">
                {CURRENCY_SYMBOL}
              </AppText>
              <TextInput
                value={amount}
                onChangeText={(text) => setAmount(formatAmountInput(text))}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                selectionColor={colors.brand}
                cursorColor={colors.brand}
                accessibilityLabel="Amount"
                autoFocus={false}
                style={[styles.input, typography.amountInput]}
              />
            </View>
          </View>

          <View style={styles.fieldsRow}>
            <View style={[styles.field, styles.flex]}>
              <AppText variant={config.labelVariant} color="textSecondary">
                {config.descriptionLabel}
              </AppText>
              <View style={[styles.box, styles.smallBox]}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder={config.descriptionPlaceholder}
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.brand}
                  cursorColor={colors.brand}
                  returnKeyType="done"
                  accessibilityLabel={config.descriptionLabel}
                  numberOfLines={1}
                  style={[styles.input, typography.input]}
                />
              </View>
            </View>

            <View style={[styles.field, styles.dateField]}>
              <AppText variant={config.labelVariant} color="textSecondary">
                Date
              </AppText>
              <DatePickerField label="Date" value={date} onChange={setDate} maxDate={new Date()} style={styles.date} />
            </View>
          </View>

          <View style={styles.field}>
            <AppText variant={config.labelVariant} color="textSecondary">
              Select Category
            </AppText>
            <View accessibilityRole="radiogroup" style={styles.categories}>
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category}
                  selected={category.id === categoryId}
                  onPress={() => setCategoryId(category.id)}
                  labelVariant={config.chipLabelVariant}
                />
              ))}
            </View>
          </View>

          <SheetButton label={config.submitLabel} disabled={!canSubmit} onPress={() => submit(close)} />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountBox: {
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  smallBox: {
    padding: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.textPrimary,
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  // Grows past Figma's 100pt for longer labels like "Yesterday" or "Sep 12".
  dateField: {
    minWidth: 100,
  },
  date: {
    gap: 4,
    padding: 10,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
