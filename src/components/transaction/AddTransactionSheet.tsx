import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText, BottomSheet, CategoryTile, DatePickerField, Icon, SheetButton } from '@/components/ui';
import { useAccounts } from '@/data/accountsStore';
import { expenseCategories, incomeCategories } from '@/data/categories';
import type { TransactionKind } from '@/data/types';
import { colors, shadows, typography, type TypographyVariant } from '@/theme';
import { CURRENCY_SYMBOL, formatAmountInput, formatCurrency, parseAmount } from '@/utils/format';

import { AccountPicker } from './AccountPicker';
import { SegmentedControl } from './SegmentedControl';

type SheetMode = TransactionKind | 'transfer';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type DraftBase = { amount: number; description: string; date: Date };

export type TransactionDraft =
  | (DraftBase & { kind: TransactionKind; categoryId: string; accountId: string })
  | (DraftBase & {
      kind: 'transfer';
      fromAccountId: string;
      toAccountId: string;
      /** Charged to the sender on top of the amount and logged as an expense; 0 for none. */
      fee: number;
    });

type Props = {
  /** Called once the dismiss animation finishes. Keep it referentially stable. */
  onClose: () => void;
  /** Resolves to an error message to show, or null once saved. */
  onSubmit: (draft: TransactionDraft) => Promise<string | null>;
};

/** Credit cards can go further into debt, so only other accounts need enough money to send. */
const CREDIT_CARD = 'credit-card';

/** Whole cents, so comparing money isn't thrown off by floating-point rounding. */
const toCents = (amount: number) => Math.round(amount * 100);

const MODE_OPTIONS = [
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
] as const;

/** Copy and label sizes that differ between the Expenses, Income and Transfer designs. */
const MODE_CONFIG: Record<
  SheetMode,
  {
    amountLabel: TypographyVariant;
    descriptionLabel: TypographyVariant;
    dateLabel: TypographyVariant;
    descriptionPlaceholder: string;
    submitLabel: string;
  }
> = {
  expense: {
    amountLabel: 'fieldLabel',
    descriptionLabel: 'fieldLabel',
    dateLabel: 'fieldLabel',
    descriptionPlaceholder: 'What was it for?',
    submitLabel: 'Add Transaction',
  },
  income: {
    amountLabel: 'fieldLabel',
    descriptionLabel: 'fieldLabelSm',
    dateLabel: 'fieldLabel',
    descriptionPlaceholder: 'Where is it from?',
    submitLabel: 'Add Income',
  },
  transfer: {
    amountLabel: 'fieldLabelSm',
    descriptionLabel: 'fieldLabelSm',
    dateLabel: 'fieldLabelSm',
    descriptionPlaceholder: 'What is it for?',
    submitLabel: 'Add Transfer',
  },
};

const firstCategory = (mode: TransactionKind) => (mode === 'expense' ? expenseCategories : incomeCategories)[0].id;

export function AddTransactionSheet({ onClose, onSubmit }: Props) {
  const [mode, setMode] = useState<SheetMode>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(firstCategory('expense'));
  const [date, setDate] = useState(() => new Date());
  const [fee, setFee] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const config = MODE_CONFIG[mode];

  const accounts = useAccounts();
  const [accountId, setAccountId] = useState(accounts[0]?.id);
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id);
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id);
  const canTransfer = accounts.length >= 2;

  const changeMode = (next: SheetMode) => {
    if (next === mode) return;
    setMode(next);
    // Categories differ per mode; amount, description and date carry over.
    if (next !== 'transfer') setCategoryId(firstCategory(next));
  };

  const swapAccounts = () => {
    setFromAccountId(toAccountId);
    setToAccountId(fromAccountId);
  };

  const amountValue = parseAmount(amount);
  const accountsReady =
    mode === 'transfer'
      ? fromAccountId !== undefined && toAccountId !== undefined && fromAccountId !== toAccountId
      : accountId !== undefined;

  // Transfers: the sender pays the amount plus the fee, and must have that much unless it's a credit card.
  const feeValue = parseAmount(fee);
  const fromAccount = accounts.find((account) => account.id === fromAccountId);
  const totalOut = amountValue + feeValue;
  const notEnough =
    mode === 'transfer' &&
    fromAccount !== undefined &&
    fromAccount.typeId !== CREDIT_CARD &&
    toCents(totalOut) > toCents(fromAccount.balance);

  const canSubmit = amountValue > 0 && accountsReady && !notEnough && !saving;

  // The sheet stays open until the save succeeds, so a failed save keeps what was typed.
  const submit = async (close: () => void) => {
    if (!canSubmit) return;
    const base = { amount: amountValue, description: description.trim(), date };
    let draft: TransactionDraft;
    if (mode === 'transfer') {
      if (!fromAccountId || !toAccountId) return;
      draft = { ...base, kind: 'transfer', fromAccountId, toAccountId, fee: feeValue };
    } else {
      if (!accountId) return;
      draft = { ...base, kind: mode, categoryId, accountId };
    }
    setSaving(true);
    setSaveError(null);
    const error = await onSubmit(draft);
    setSaving(false);
    if (error) setSaveError(error);
    else close();
  };

  const withAccount = mode !== 'transfer' && accounts.length > 0;

  const amountField = (
    <View style={[styles.field, withAccount && styles.flex]}>
      <AppText variant={config.amountLabel} color="textSecondary">
        Amount
      </AppText>
      <View style={[styles.box, styles.amountBox, withAccount && styles.amountBoxFill]}>
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
  );

  return (
    <BottomSheet title="Add Transaction" onClose={onClose}>
      {(close) => (
        <>
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={changeMode} />

          {/* Expenses and Income: the account sits beside the amount (Figma: 212pt + 10pt + 128pt). */}
          {withAccount ? (
            <View style={styles.amountRow}>
              {amountField}
              <View style={[styles.field, styles.accountField]}>
                <AppText variant="fieldLabelSm" color="textSecondary">
                  Account
                </AppText>
                <AccountPicker label="Account" accounts={accounts} value={accountId} onChange={setAccountId} />
              </View>
            </View>
          ) : (
            amountField
          )}

          {mode === 'transfer' ? (
            <View style={styles.transferRow}>
              <View style={[styles.field, styles.flex]}>
                <AppText variant="fieldLabelSm" color="textSecondary">
                  From
                </AppText>
                <AccountPicker label="From account" accounts={accounts} value={fromAccountId} onChange={setFromAccountId} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Swap accounts"
                hitSlop={6}
                onPress={swapAccounts}
                style={({ pressed }) => [styles.direction, pressed && styles.pressed]}>
                <Icon name="arrowRightTransfer" />
              </Pressable>
              <View style={[styles.field, styles.flex]}>
                <AppText variant="fieldLabelSm" color="textSecondary">
                  To
                </AppText>
                <AccountPicker label="To account" accounts={accounts} value={toAccountId} onChange={setToAccountId} />
              </View>
            </View>
          ) : null}

          {mode === 'transfer' && !canTransfer ? (
            <AppText variant="caption" color="textSecondary">
              Add another account to move money between them.
            </AppText>
          ) : null}

          {mode === 'transfer' ? (
            <View style={styles.field}>
              <AppText variant="fieldLabelSm" color="textSecondary">
                Transfer Fee
              </AppText>
              <View style={[styles.box, styles.smallBox, styles.feeBox]}>
                <AppText variant="input" color="textSecondary">
                  {CURRENCY_SYMBOL}
                </AppText>
                <TextInput
                  value={fee}
                  onChangeText={(text) => setFee(formatAmountInput(text))}
                  placeholder="0.00 (optional)"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  selectionColor={colors.brand}
                  cursorColor={colors.brand}
                  accessibilityLabel="Transfer fee"
                  accessibilityHint="Charged to the sending account and logged as an expense"
                  style={[styles.input, typography.input]}
                />
              </View>
              {notEnough && fromAccount ? (
                <AppText variant="caption" color="danger" accessibilityLiveRegion="polite">
                  {`Not enough in ${fromAccount.name}. Available: ${formatCurrency(fromAccount.balance, { decimals: 2 })}`}
                </AppText>
              ) : feeValue > 0 && fromAccount ? (
                <AppText variant="caption" color="textSecondary">
                  {`${formatCurrency(totalOut, { decimals: 2 })} leaves ${fromAccount.name}; the fee is logged as an expense.`}
                </AppText>
              ) : null}
            </View>
          ) : null}

          <View style={styles.fieldsRow}>
            <View style={[styles.field, styles.flex]}>
              <AppText variant={config.descriptionLabel} color="textSecondary">
                Description
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
                  accessibilityLabel="Description"
                  numberOfLines={1}
                  style={[styles.input, typography.input]}
                />
              </View>
            </View>

            <View style={[styles.field, styles.dateField]}>
              <AppText variant={config.dateLabel} color="textSecondary">
                Date
              </AppText>
              <DatePickerField
                label="Date"
                value={date}
                onChange={setDate}
                maxDate={new Date()}
                icon={mode === 'transfer' ? 'calendarDaysSm' : 'calendarSm'}
                style={[styles.date, mode === 'transfer' && styles.dateTransfer]}
              />
            </View>
          </View>

          {mode !== 'transfer' ? (
            <View style={styles.field}>
              <AppText variant="fieldLabel" color="textSecondary">
                Select Category
              </AppText>
              <View accessibilityRole="radiogroup" style={styles.tiles}>
                {(mode === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                  <CategoryTile
                    key={category.id}
                    label={category.label}
                    artwork={category.artwork}
                    selected={category.id === categoryId}
                    onPress={() => setCategoryId(category.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {saveError ? (
            <AppText variant="captionSm" color="danger" accessibilityLiveRegion="polite">
              {saveError}
            </AppText>
          ) : null}
          <SheetButton
            label={saving ? 'Saving…' : config.submitLabel}
            disabled={!canSubmit}
            onPress={() => submit(close)}
            style={mode === 'transfer' && styles.transferButton}
          />
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
    borderWidth: STROKE,
    borderColor: colors.border,
  },
  amountBox: {
    gap: 6,
    paddingHorizontal: 12 - STROKE,
    paddingVertical: 8 - STROKE,
    borderRadius: 14,
  },
  // Stretches to the 54pt account selector beside it.
  amountBoxFill: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  accountField: {
    width: 128,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  direction: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.brandWashBorder,
    backgroundColor: colors.brandWash,
  },
  pressed: {
    opacity: 0.7,
  },
  smallBox: {
    padding: 10 - STROKE,
    borderRadius: 10,
  },
  feeBox: {
    gap: 6,
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
    padding: 10 - STROKE,
  },
  dateTransfer: {
    gap: 5,
  },
  transferButton: {
    boxShadow: shadows.buttonSoft,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 10,
    rowGap: 6,
  },
});
