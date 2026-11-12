import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText, FillMask, Icon, type IconName } from '@/components/ui';
import { colors, typography } from '@/theme';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  icon: IconName;
  /** Masks the text and adds the eye button that reveals it. */
  password?: boolean;
  /** Shown under the field, with a red border, after a failed submit. */
  error?: string;
};

/** Labelled 50pt input from the sign-up form. */
export function AuthInput({ label, icon, password = false, error, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.field}>
      <AppText variant="labelSemibold">{label}</AppText>
      <View style={[styles.input, focused && styles.inputFocused, error !== undefined && styles.inputError]}>
        <Icon name={icon} />
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.brand}
          cursorColor={colors.brand}
          secureTextEntry={password && !revealed}
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
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            hitSlop={10}
            onPress={() => setRevealed((value) => !value)}>
            {/* Brand green while the password is visible. */}
            <FillMask fill={revealed ? colors.brand : colors.textSecondary}>
              <Icon name="authEye" />
            </FillMask>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="captionSm" color="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  input: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14 - STROKE,
    borderRadius: 14,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputFocused: {
    borderColor: colors.brand,
  },
  inputError: {
    borderColor: colors.danger,
  },
  text: {
    ...typography.inputLg,
    flex: 1,
    height: '100%',
    padding: 0,
    color: colors.textPrimary,
  },
});
