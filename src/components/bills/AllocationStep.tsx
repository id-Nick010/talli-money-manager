import { Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';

import { AppText, Avatar, Icon, SheetButton } from '@/components/ui';
import { colors, radii, shadows, typography } from '@/theme';
import { CURRENCY_SYMBOL, formatAmountInput, formatCurrency, parseAmount } from '@/utils/format';

/** Figma keeps 1pt strokes out of the padding; React Native pads inside the border. */
const STROKE = 1;
/** Room for nothing to be clipped at the list's edges; offset with negative margins. */
const LIST_BLEED = 1;

/** One person splitting the bill, as edited in the allocation step. */
export type MemberDraft = {
  key: string;
  name: string;
  /** Formatted amount text, as typed. */
  amount: string;
};

const isBlank = (member: MemberDraft) => member.name.trim() === '' && parseAmount(member.amount) === 0;

/** Whether the allocation can be saved: every person named, and the amounts add up to the total. */
export function canSaveAllocation(members: MemberDraft[], total: number) {
  const filled = members.filter((member) => !isBlank(member));
  if (filled.length === 0 || total <= 0) return false;
  if (filled.some((member) => member.name.trim() === '')) return false;
  const allocated = filled.reduce((sum, member) => sum + Math.round(parseAmount(member.amount) * 100), 0);
  return allocated === Math.round(total * 100);
}

/** Splits `total` across `count` people to the cent; leftover cents go to the first people. */
function splitEvenly(total: number, count: number) {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  return Array.from({ length: count }, (_, index) => (base + (index < cents - base * count ? 1 : 0)) / 100);
}

const formatShare = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Props = {
  billName: string;
  total: number;
  members: MemberDraft[];
  onChange: (members: MemberDraft[]) => void;
  onAddMember: () => void;
  onSave: () => void;
};

/** "Allocate bill amounts": who is splitting the bill and how much each person owes. */
export function AllocationStep({ billName, total, members, onChange, onAddMember, onSave }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const namedCount = members.filter((member) => member.name.trim() !== '').length;
  const canSave = canSaveAllocation(members, total);

  const update = (key: string, patch: Partial<MemberDraft>) =>
    onChange(members.map((member) => (member.key === key ? { ...member, ...patch } : member)));

  const remove = (key: string) => onChange(members.filter((member) => member.key !== key));

  const splitEqually = () => {
    const named = members.filter((member) => member.name.trim() !== '');
    const targets = named.length > 0 ? named : members;
    if (targets.length === 0 || total <= 0) return;
    const shares = splitEvenly(total, targets.length);
    const shareByKey = new Map(targets.map((member, index) => [member.key, formatShare(shares[index])]));
    onChange(members.map((member) => ({ ...member, amount: shareByKey.get(member.key) ?? member.amount })));
  };

  return (
    <>
      <AppText variant="caption" color="textSecondary" style={styles.instruction}>
        Enter what each person owes. The amounts must add up to the bill total.
      </AppText>

      <View style={styles.billTotal}>
        <View style={styles.billContext}>
          <AppText variant="fieldLabelXs" color="textSecondary">
            Bill name
          </AppText>
          <AppText variant="displayBody" numberOfLines={1}>
            {billName || 'Untitled bill'}
          </AppText>
        </View>
        <AppText variant="amountInput" numberOfLines={1} style={styles.totalAmount}>
          {formatCurrency(total, { decimals: 2 })}
        </AppText>
      </View>

      <View style={styles.membersHeader}>
        <AppText variant="fieldLabelSm" color="textSecondary" style={styles.membersLabel}>
          {`Users (${namedCount})`}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Divides the bill total evenly between everyone"
          onPress={splitEqually}
          style={({ pressed }) => [styles.splitPill, pressed && styles.pressed]}>
          <Icon name="divide" />
          <AppText variant="captionMedium" color="brand" style={styles.pillLabel}>
            Split equally
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        style={[styles.list, { maxHeight: windowHeight * 0.32 }]}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {members.map((member, index) => (
          <MemberRow
            key={member.key}
            member={member}
            index={index}
            onChangeName={(name) => update(member.key, { name })}
            onChangeAmount={(amount) => update(member.key, { amount: formatAmountInput(amount) })}
            onRemove={() => remove(member.key)}
          />
        ))}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        onPress={onAddMember}
        style={({ pressed }) => [styles.addUser, pressed && styles.pressed]}>
        <Icon name="plusMuted" />
        <AppText variant="captionMedium" color="black" style={styles.pillLabel}>
          Add user
        </AppText>
      </Pressable>

      <SheetButton label="Save allocations" disabled={!canSave} onPress={onSave} style={styles.save} />
    </>
  );
}

type MemberRowProps = {
  member: MemberDraft;
  index: number;
  onChangeName: (name: string) => void;
  onChangeAmount: (amount: string) => void;
  onRemove: () => void;
};

function MemberRow({ member, index, onChangeName, onChangeAmount, onRemove }: MemberRowProps) {
  const name = member.name.trim();
  const label = name || `User ${index + 1}`;

  return (
    <View style={styles.row}>
      {name ? <Avatar id={member.key} name={name} /> : <View style={styles.emptyAvatar} />}
      <TextInput
        value={member.name}
        onChangeText={onChangeName}
        placeholder="User"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.brand}
        cursorColor={colors.brand}
        autoCapitalize="words"
        returnKeyType="next"
        accessibilityLabel={`User ${index + 1} name`}
        numberOfLines={1}
        style={[styles.nameInput, typography.displayBody]}
      />
      <View style={styles.amountBox}>
        <AppText variant="currencySm" color="brand">
          {CURRENCY_SYMBOL}
        </AppText>
        <TextInput
          value={member.amount}
          onChangeText={onChangeAmount}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          selectionColor={colors.brand}
          cursorColor={colors.brand}
          accessibilityLabel={`${label} amount`}
          style={[styles.amountInput, typography.displayBody]}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label}`}
        hitSlop={4}
        onPress={onRemove}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
        <Icon name="trash" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
  instruction: {
    lineHeight: 16,
  },
  billTotal: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14 - STROKE,
    borderRadius: radii.lg,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  billContext: {
    flexShrink: 1,
    gap: 2,
  },
  totalAmount: {
    lineHeight: 24,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersLabel: {
    lineHeight: 15,
  },
  splitPill: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.brandWash,
  },
  pillLabel: {
    lineHeight: 16,
  },
  list: {
    flexGrow: 0,
    margin: -LIST_BLEED,
  },
  listContent: {
    gap: 8,
    padding: LIST_BLEED,
  },
  row: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12 - STROKE,
    paddingVertical: 8 - STROKE,
    borderRadius: radii.md,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.avatarEmpty,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.textPrimary,
  },
  amountBox: {
    width: 124,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10 - STROKE,
    borderRadius: 10,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  amountInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    textAlign: 'right',
    color: colors.textPrimary,
  },
  remove: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  addUser: {
    alignSelf: 'flex-start',
    width: 103,
    height: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: radii.pill,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  save: {
    height: 50,
    paddingVertical: 0,
    boxShadow: shadows.buttonLg,
  },
});
