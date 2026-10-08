import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText, BottomSheet, CategoryTile, DatePickerField, Icon, SelectField, SheetButton } from '@/components/ui';
import { budgetCategories } from '@/data/categories';
import { colors, typography } from '@/theme';
import { CURRENCY_SYMBOL, formatAmountInput, parseAmount } from '@/utils/format';

import { AllocationStep, canSaveAllocation, type MemberDraft } from './AllocationStep';

const RECURRENCE_OPTIONS = ['No', 'Monthly', 'Yearly'] as const;

/** Figma keeps the 1pt input stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

export type BillRecurrence = (typeof RECURRENCE_OPTIONS)[number];

export type BillDraft = {
  name: string;
  amount: number;
  dueDate: Date;
  /** The people splitting the bill and what each one owes; amounts add up to `amount`. */
  users: { name: string; amount: number }[];
  recurrence: BillRecurrence;
  categoryId: string;
};

type Props = {
  /** Called once the dismiss animation finishes. Keep it referentially stable. */
  onClose: () => void;
  onSubmit: (draft: BillDraft) => void;
};

export function AddBillSheet({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'details' | 'users'>('details');
  // Saved allocation, and the copy being edited in the users step (discarded on back).
  const [members, setMembers] = useState<MemberDraft[]>([]);
  const [editingMembers, setEditingMembers] = useState<MemberDraft[]>([]);
  const nextKey = useRef(0);
  const [recurrence, setRecurrence] = useState<BillRecurrence>('No');
  const [dueDate, setDueDate] = useState(() => new Date());
  const [categoryId, setCategoryId] = useState(budgetCategories[0].id);

  const amountValue = parseAmount(amount);
  const canSubmit = name.trim().length > 0 && amountValue > 0;
  const userNames = members.map((member) => member.name.trim()).filter(Boolean);

  const newMember = (): MemberDraft => ({ key: `member-${nextKey.current++}`, name: '', amount: '' });

  // A new allocation starts with one empty, editable person.
  const openUsers = () => {
    setEditingMembers(members.length > 0 ? members : [newMember()]);
    setStep('users');
  };

  const saveUsers = () => {
    if (!canSaveAllocation(editingMembers, amountValue)) return;
    setMembers(editingMembers.filter((member) => member.name.trim() !== ''));
    setStep('details');
  };

  const submit = (close: () => void) => {
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      amount: amountValue,
      dueDate,
      users: members.map((member) => ({ name: member.name.trim(), amount: parseAmount(member.amount) })),
      recurrence,
      categoryId,
    });
    close();
  };

  if (step === 'users') {
    return (
      <BottomSheet
        title="Allocate bill amounts"
        onClose={onClose}
        onBack={() => setStep('details')}
        minBottomPadding={22}
        closePadding={6}>
        {() => (
          <AllocationStep
            billName={name.trim()}
            total={amountValue}
            members={editingMembers}
            onChange={setEditingMembers}
            onAddMember={() => setEditingMembers((current) => [...current, newMember()])}
            onSave={saveUsers}
          />
        )}
      </BottomSheet>
    );
  }

  return (
    <BottomSheet title="Add Active Bill" onClose={onClose} gap={14} minBottomPadding={24} closePadding={6}>
      {(close) => (
        <>
          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.label}>
              Bill Name
            </AppText>
            <View style={[styles.box, styles.nameBox]}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Trip to Vietnam"
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.brand}
                cursorColor={colors.brand}
                returnKeyType="next"
                accessibilityLabel="Bill name"
                numberOfLines={1}
                style={[styles.input, typography.inputLg, styles.nameText]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.label}>
              Total Amount
            </AppText>
            <View style={[styles.box, styles.amountBox]}>
              <AppText variant="amountInput" color="brand" style={styles.amountText}>
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
                accessibilityLabel="Total amount"
                style={[styles.input, typography.amountInput, styles.amountText]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.label}>
              Due Date
            </AppText>
            <DatePickerField
              label="Due date"
              icon="calendarSmBold"
              value={dueDate}
              onChange={setDueDate}
              minDate={new Date()}
            />
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.label}>
              Users
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={userNames.length > 0 ? `Users: ${userNames.join(', ')}` : 'Add users'}
              accessibilityHint="Choose who splits the bill and how much each person owes"
              onPress={openUsers}
              style={({ pressed }) => [styles.box, styles.smallBox, pressed && styles.pressed]}>
              <Icon name="userSm" />
              <AppText
                variant="inputMedium"
                color={userNames.length > 0 ? 'textPrimary' : 'textSecondary'}
                numberOfLines={1}
                style={[styles.flex, styles.smallText]}>
                {userNames.length > 0 ? userNames.join(', ') : 'Add users'}
              </AppText>
            </Pressable>
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.label}>
              Recurring
            </AppText>
            <SelectField label="Recurring" value={recurrence} options={RECURRENCE_OPTIONS} onChange={setRecurrence} />
          </View>

          <View accessibilityRole="radiogroup" accessibilityLabel="Category" style={styles.categories}>
            {budgetCategories.map((category) => (
              <CategoryTile
                key={category.id}
                label={category.label}
                artwork={category.artwork}
                selected={category.id === categoryId}
                onPress={() => setCategoryId(category.id)}
              />
            ))}
          </View>

          <SheetButton label="Add Bill" disabled={!canSubmit} onPress={() => submit(close)} style={styles.cta} />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    lineHeight: 15,
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
  nameBox: {
    padding: 12 - STROKE,
    borderRadius: 12,
  },
  nameText: {
    height: 19,
    lineHeight: 19,
  },
  amountBox: {
    gap: 6,
    paddingHorizontal: 14 - STROKE,
    paddingVertical: 10 - STROKE,
    borderRadius: 14,
  },
  amountText: {
    height: 24,
    lineHeight: 24,
  },
  smallBox: {
    gap: 6,
    padding: 10 - STROKE,
    borderRadius: 10,
  },
  smallText: {
    height: 18,
    lineHeight: 18,
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.textPrimary,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 10,
    rowGap: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  cta: {
    paddingVertical: 14,
  },
});
