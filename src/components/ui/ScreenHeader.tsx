import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  title: string;
  /** Makes the title tappable and shows a dropdown caret next to it (e.g. a month picker). */
  onPressTitle?: () => void;
  titleAccessibilityLabel?: string;
  /** Trailing buttons, typically `IconButton`s. */
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** 73pt top bar shared by the main tab screens. */
export function ScreenHeader({ title, onPressTitle, titleAccessibilityLabel, actions, style }: Props) {
  const heading = (
    <AppText variant="title" numberOfLines={1} style={styles.title} accessibilityRole="header">
      {title}
    </AppText>
  );

  return (
    <View style={[styles.header, style]}>
      {onPressTitle ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={titleAccessibilityLabel ?? title}
          onPress={onPressTitle}
          style={({ pressed }) => [styles.titleGroup, pressed && styles.pressed]}>
          {heading}
          <View style={styles.caret}>
            <Icon name="chevronRight" style={styles.caretIcon} />
          </View>
        </Pressable>
      ) : (
        <View style={styles.titleGroup}>{heading}</View>
      )}

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 73,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenX,
  },
  titleGroup: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  caret: {
    width: 9,
    height: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caretIcon: {
    transform: [{ rotate: '90deg' }],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});
