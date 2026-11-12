import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

const goBack = () => router.back();

type Props = {
  title: string;
  /** Text button on the right, e.g. "Save". */
  actionLabel?: string;
  onPressAction?: () => void;
  actionDisabled?: boolean;
};

/** 56pt header of pages pushed onto a tab's stack: back button, centred title, optional text action. */
export function PageHeader({ title, actionLabel, onPressAction, actionDisabled = false }: Props) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={4}
        onPress={goBack}
        style={({ pressed }) => pressed && styles.pressed}>
        <Icon name="backButton" />
      </Pressable>
      <AppText variant="sheetTitle" numberOfLines={1} accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: actionDisabled }}
          disabled={actionDisabled}
          onPress={onPressAction}
          style={({ pressed }) => [styles.action, actionDisabled && styles.disabled, pressed && styles.pressed]}>
          <AppText variant="headerAction" color="brand">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: spacing.screenX,
  },
  title: {
    flexShrink: 1,
  },
  action: {
    minWidth: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  spacer: {
    width: 40,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
