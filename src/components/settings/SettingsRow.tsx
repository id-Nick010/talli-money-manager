import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Icon, Toggle, type IconName } from '@/components/ui';
import { colors } from '@/theme';

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  /** Current value shown before the chevron — "PHP", "Light". */
  value?: string;
  /** Red styling for destructive actions like "Sign out". */
  destructive?: boolean;
  onPress?: () => void;
  /**
   * Shows a switch instead of the chevron; tapping anywhere on the row flips it. Leave out `onChange`
   * for a setting that's always on.
   */
  toggle?: { value: boolean; onChange?: (value: boolean) => void; disabled?: boolean; fill?: 'gradient' | 'solid' };
};

export function SettingsRow({ icon, title, subtitle, value, destructive = false, onPress, toggle }: Props) {
  const toggleDisabled = toggle?.disabled ?? false;
  const onPressRow = toggle ? (toggle.onChange ? () => toggle.onChange?.(!toggle.value) : undefined) : onPress;

  return (
    <Pressable
      accessibilityRole={toggle ? 'switch' : 'button'}
      accessibilityLabel={value ? `${title}, ${value}` : title}
      accessibilityHint={subtitle}
      accessibilityState={
        toggle ? { checked: toggle.value, disabled: toggleDisabled || !toggle.onChange } : undefined
      }
      disabled={toggle ? toggleDisabled || !toggle.onChange : false}
      onPress={onPressRow}
      style={({ pressed }) => [styles.row, toggleDisabled && styles.disabled, pressed && styles.pressed]}>
      <View style={[styles.tile, destructive && styles.tileDestructive]}>
        <Icon name={icon} />
      </View>

      <View style={styles.copy}>
        <AppText variant="labelSemiboldMd" color={destructive ? 'dangerMuted' : 'textPrimary'} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="captionSm" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {value ? (
        <AppText variant="labelSemibold" color="textSecondary">
          {value}
        </AppText>
      ) : null}
      {toggle ? <Toggle value={toggle.value} fill={toggle.fill} /> : <Icon name="chevronRightMuted" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.5,
  },
  tile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileDestructive: {
    backgroundColor: colors.dangerTint,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
