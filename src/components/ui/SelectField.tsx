import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { Popover } from './Popover';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props<T extends string> = {
  /** Used for the screen-reader label, e.g. "Recurring". */
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

/** Sheet-style dropdown: a field whose options float in a menu just below it. */
export function SelectField<T extends string>({ label, value, options, onChange }: Props<T>) {
  const anchor = useRef<View>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        ref={anchor}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.field, open && styles.fieldOpen, pressed && styles.pressed]}>
        <AppText variant="inputMedium" style={styles.value}>
          {value}
        </AppText>
        <Icon name="chevronDownSm" style={open && styles.chevronOpen} />
      </Pressable>

      <Popover anchor={anchor} visible={open} onClose={() => setOpen(false)}>
        <View accessibilityRole="menu" style={styles.menu}>
          {options.map((option) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
                style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}>
                <AppText variant="inputMedium" color={selected ? 'brand' : 'textPrimary'} style={styles.value}>
                  {option}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10 - STROKE,
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
  value: {
    flex: 1,
    minWidth: 0,
    height: 18,
    lineHeight: 18,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  menu: {
    padding: 4,
  },
  option: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: colors.brandWash,
  },
});
