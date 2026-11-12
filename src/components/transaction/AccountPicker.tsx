import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, ArtworkFrame, Icon, Popover } from '@/components/ui';
import { accountArtwork } from '@/data/categories';
import type { Account } from '@/data/types';
import { colors, radii } from '@/theme';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = {
  /** Used for the screen-reader label, e.g. "From account". */
  label: string;
  accounts: readonly Account[];
  value: string | undefined;
  onChange: (accountId: string) => void;
};

function AccountTile({ account }: { account: Account }) {
  return (
    <View style={styles.tile}>
      <ArtworkFrame artwork={accountArtwork(account)} />
    </View>
  );
}

/** Account dropdown showing the account's illustration and name, as in the Add Transaction sheet. */
export function AccountPicker({ label, accounts, value, onChange }: Props) {
  const anchor = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const selected = accounts.find((account) => account.id === value);

  return (
    <>
      <Pressable
        ref={anchor}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.name ?? 'none'}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.field, open && styles.fieldOpen, pressed && styles.pressed]}>
        {/* An empty tile keeps the field's shape until an account is picked. */}
        {selected ? <AccountTile account={selected} /> : <View style={styles.tile} />}
        <AppText
          variant="labelSemiboldSm"
          color={selected ? 'textPrimary' : 'textMuted'}
          numberOfLines={1}
          style={styles.name}>
          {selected?.name ?? 'Select'}
        </AppText>
        <Icon name="chevronDownAccount" style={open && styles.chevronOpen} />
      </Pressable>

      <Popover anchor={anchor} visible={open} onClose={() => setOpen(false)} minWidth={180}>
        <View accessibilityRole="menu" style={styles.menu}>
          {accounts.map((account) => {
            const isSelected = account.id === value;
            return (
              <Pressable
                key={account.id}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onChange(account.id);
                  setOpen(false);
                }}
                style={({ pressed }) => [styles.option, isSelected && styles.optionSelected, pressed && styles.pressed]}>
                <AccountTile account={account} />
                <AppText
                  variant="inputMedium"
                  color={isSelected ? 'brand' : 'textPrimary'}
                  numberOfLines={1}
                  style={styles.name}>
                  {account.name}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Popover>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8 - STROKE,
    borderRadius: 10,
    borderWidth: STROKE,
    borderColor: colors.border,
  },
  fieldOpen: {
    borderColor: colors.brand,
  },
  pressed: {
    opacity: 0.6,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.successSoft,
  },
  name: {
    flex: 1,
    minWidth: 0,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  menu: {
    padding: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: colors.brandWash,
  },
});
