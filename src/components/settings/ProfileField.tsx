import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText, Icon, type IconName } from '@/components/ui';
import { colors, typography } from '@/theme';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type FieldProps = {
  label: string;
  /** The input itself — a `ProfileInput`, or another control styled with `profileInputStyle`. */
  children: ReactNode;
};

/** Uppercase label stacked above a profile form input. */
export function ProfileField({ label, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <AppText variant="fieldLabelBold" color="textSecondary">
        {label}
      </AppText>
      {children}
    </View>
  );
}

type InputProps = Omit<TextInputProps, 'style'> & {
  icon: IconName;
};

export function ProfileInput({ icon, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[profileInputStyle.input, focused && styles.inputFocused]}>
      <Icon name={icon} />
      <TextInput
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.brand}
        {...rest}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={styles.text}
      />
    </View>
  );
}

/** Shared look of the profile form inputs, also applied to the date-of-birth picker field. */
export const profileInputStyle = StyleSheet.create({
  input: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12 - STROKE,
    paddingVertical: 0,
    borderRadius: 14,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surfaceInput,
  },
});

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  inputFocused: {
    borderColor: colors.brand,
  },
  text: {
    ...typography.inputMedium,
    flex: 1,
    height: '100%',
    padding: 0,
    color: colors.textPrimary,
  },
});
