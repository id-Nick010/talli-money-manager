import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, BottomSheet, CategoryTile, SheetButton } from '@/components/ui';
import { accountTypes } from '@/data/categories';
import { colors, typography } from '@/theme';
import { CURRENCY_SYMBOL, formatAmountInput, parseAmount } from '@/utils/format';

/** Figma keeps the 1pt input stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

export type AccountDraft = {
  name: string;
  description: string;
  initialBalance: number;
  typeId: string;
};

type Props = {
  /** Called once the dismiss animation finishes. Keep it referentially stable. */
  onClose: () => void;
  onSubmit: (draft: AccountDraft) => void;
};

export function AddAccountSheet({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setBalance] = useState('');
  const [typeId, setTypeId] = useState(accountTypes[0].id);

  const canSubmit = name.trim().length > 0;

  const submit = (close: () => void) => {
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), description: description.trim(), initialBalance: parseAmount(balance), typeId });
    close();
  };

  return (
    <BottomSheet title="Add Account" onClose={onClose}>
      {(close) => (
        <>
          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.labelSm}>
              Account Name
            </AppText>
            <View style={[styles.box, styles.nameBox]}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Main Account"
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.brand}
                cursorColor={colors.brand}
                returnKeyType="next"
                accessibilityLabel="Account name"
                numberOfLines={1}
                style={[styles.input, typography.inputLg, styles.nameText]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.labelSm}>
              Description
            </AppText>
            <View style={[styles.box, styles.descriptionBox]}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. BPI"
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.brand}
                cursorColor={colors.brand}
                returnKeyType="next"
                accessibilityLabel="Description"
                numberOfLines={1}
                style={[styles.input, typography.input, styles.descriptionText]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabelSm" color="textSecondary" style={styles.labelSm}>
              Initial Balance
            </AppText>
            <View style={[styles.box, styles.amountBox]}>
              <AppText variant="amountInput" color="brand" style={styles.amountText}>
                {CURRENCY_SYMBOL}
              </AppText>
              <TextInput
                value={balance}
                onChangeText={(text) => setBalance(formatAmountInput(text))}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                selectionColor={colors.brand}
                cursorColor={colors.brand}
                accessibilityLabel="Initial balance"
                style={[styles.input, typography.amountInput, styles.amountText]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <AppText variant="fieldLabel" color="textSecondary" style={styles.label}>
              Select Category
            </AppText>
            <View accessibilityRole="radiogroup" style={styles.types}>
              {accountTypes.map((type) => (
                <CategoryTile
                  key={type.id}
                  label={type.label}
                  artwork={type.artwork}
                  selected={type.id === typeId}
                  onPress={() => setTypeId(type.id)}
                />
              ))}
            </View>
          </View>

          <SheetButton label="Add Account" disabled={!canSubmit} onPress={() => submit(close)} />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  labelSm: {
    lineHeight: 15,
  },
  label: {
    lineHeight: 16,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: STROKE,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.textPrimary,
  },
  nameBox: {
    padding: 12 - STROKE,
    borderRadius: 12,
  },
  nameText: {
    height: 19,
    lineHeight: 19,
  },
  descriptionBox: {
    padding: 10 - STROKE,
    borderRadius: 10,
  },
  descriptionText: {
    height: 18,
    lineHeight: 18,
  },
  amountBox: {
    gap: 6,
    paddingHorizontal: 12 - STROKE,
    paddingVertical: 8 - STROKE,
    borderRadius: 14,
  },
  amountText: {
    height: 24,
    lineHeight: 24,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 6,
  },
});
