import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { colors, radii } from '@/theme';

import { Icon, type IconName } from './Icon';

type Props = Omit<PressableProps, 'children'> & {
  icon: IconName;
  /** Shows the unread dot in the top-right corner. */
  badge?: boolean;
};

export function IconButton({ icon, badge = false, style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      {...rest}
      style={(state) => [styles.button, state.pressed && styles.pressed, typeof style === 'function' ? style(state) : style]}>
      <Icon name={icon} />
      {badge ? (
        <View style={styles.badge}>
          <Icon name="dot" />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
