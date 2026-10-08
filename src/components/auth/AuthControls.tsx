import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, BrandGradient, Icon } from '@/components/ui';
import { colors, radii, shadows } from '@/theme';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;
/** Figma's 169° gradient on the 350×50 pill, with its 6.5%–114.5% stops folded into the handles. */
const PILL_GRADIENT = { x1: 0.4725, y1: -0.4905, x2: 0.5408, y2: 1.968 };

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accessibilityLabel: string;
  /** The text beside the box; tapping it also toggles the box. */
  children: ReactNode;
  gap: number;
  /** `start` for multi-line text (the consent line), `center` for a single line. */
  align?: 'start' | 'center';
};

export function Checkbox({ checked, onChange, accessibilityLabel, children, gap, align = 'start' }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPress={() => onChange(!checked)}
      style={[styles.checkboxRow, { gap, alignItems: align === 'center' ? 'center' : 'flex-start' }]}>
      <View style={[styles.box, checked && styles.boxChecked]}>{checked ? <Icon name="checkboxCheck" /> : null}</View>
      {children}
    </Pressable>
  );
}

type PillButtonProps = {
  label: string;
  onPress: () => void;
};

/** Full-width gradient pill with a trailing arrow — the screens' main action. */
export function PillButton({ label, onPress }: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}>
      <View style={styles.pillFill}>
        <BrandGradient vector={PILL_GRADIENT} locations={[0, 1]} />
      </View>
      <AppText variant="buttonBody" color="white">
        {label}
      </AppText>
      <Icon name="arrowRightWhite" />
    </Pressable>
  );
}

type SocialSignInProps = {
  /** Sign up draws a 20pt-tall Apple mark; Log in a 17pt one. */
  variant: 'sign-up' | 'log-in';
  onPressGoogle: () => void;
  onPressApple: () => void;
};

export function SocialSignIn({ variant, onPressGoogle, onPressApple }: SocialSignInProps) {
  return (
    <View style={styles.social}>
      <View style={styles.divider}>
        <View style={styles.rule} />
        <AppText variant="captionSm" color="textSecondary">
          or continue with
        </AppText>
        <View style={styles.rule} />
      </View>

      <View style={styles.providers}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          onPress={onPressGoogle}
          style={({ pressed }) => [styles.provider, pressed && styles.pressed]}>
          <Icon name="googleMark" />
          <AppText variant="labelSemiboldMd">Google</AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Apple"
          onPress={onPressApple}
          style={({ pressed }) => [styles.provider, pressed && styles.pressed]}>
          <Icon name={variant === 'log-in' ? 'appleMarkSm' : 'appleMark'} />
          <AppText variant="labelSemiboldMd">Apple</AppText>
        </Pressable>
      </View>
    </View>
  );
}

type SwitchPromptProps = {
  prompt: string;
  action: string;
  onPress: () => void;
};

/** "Already have an account? Log in" line at the bottom of the screens. */
export function SwitchPrompt({ prompt, action, onPress }: SwitchPromptProps) {
  return (
    <AppText variant="authSubtitle" color="textSecondary" style={styles.switchPrompt}>
      {`${prompt} `}
      <AppText variant="labelSemiboldMd" color="brand" accessibilityRole="link" onPress={onPress}>
        {action}
      </AppText>
    </AppText>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
  },
  box: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  boxChecked: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  pill: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.pill,
    boxShadow: shadows.ctaPill,
  },
  pillFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  pillPressed: {
    transform: [{ scale: 0.98 }],
  },
  social: {
    gap: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  providers: {
    flexDirection: 'row',
    gap: 10,
  },
  provider: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  switchPrompt: {
    // Figma sets this line at the font's normal height, not the subtitle's 1.45.
    lineHeight: undefined,
    textAlign: 'center',
  },
});
