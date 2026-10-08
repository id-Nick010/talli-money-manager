import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BrandGradient, FillMask, Icon, type IconName } from '@/components/ui';
import { colors, radii, shadows, TAB_BAR_HEIGHT } from '@/theme';

export type TabMeta = { label: string; icon: IconName };

type Props = BottomTabBarProps & {
  tabs: Record<string, TabMeta>;
  /** Route names are split around the centre action button after this many tabs. */
  actionIndex: number;
  onPressAction: () => void;
  /** Why the centre action can't be used yet; when set, the button is dimmed and inert. */
  actionLockedHint?: string;
  /** Tabs that can't be opened yet (route name → what unlocks it); shown dimmed and inert. */
  locked?: ReadonlyMap<string, string>;
};

/**
 * Total height the floating tab bar covers at the bottom of the screen (bar + home-indicator inset).
 * Screens use it to pad scrollable content so the last item can scroll clear of the bar.
 */
export function useTabBarInset() {
  return TAB_BAR_HEIGHT + useSafeAreaInsets().bottom;
}

export function BottomTabBar({ state, navigation, tabs, actionIndex, onPressAction, actionLockedHint, locked }: Props) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((route) => tabs[route.name]);

  const renderTab = (route: (typeof state.routes)[number]) => {
    const meta = tabs[route.name];
    const focused = state.routes[state.index]?.key === route.key;
    const lockedHint = focused ? undefined : locked?.get(route.name);
    const disabled = lockedHint !== undefined;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused, disabled }}
        accessibilityLabel={meta.label}
        accessibilityHint={lockedHint}
        disabled={disabled}
        onPress={onPress}
        style={[styles.tab, disabled && styles.tabLocked]}>
        <FillMask fill={focused ? 'brand' : colors.textSecondary}>
          <Icon name={meta.icon} />
        </FillMask>
        {focused ? (
          <FillMask>
            <AppText variant="tabLabelActive">{meta.label}</AppText>
          </FillMask>
        ) : (
          <AppText variant="tabLabel" color="textSecondary">
            {meta.label}
          </AppText>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {routes.slice(0, actionIndex).map(renderTab)}
        <View style={styles.tab}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add transaction"
            accessibilityState={{ disabled: actionLockedHint !== undefined }}
            accessibilityHint={actionLockedHint}
            disabled={actionLockedHint !== undefined}
            onPress={onPressAction}
            style={({ pressed }) => [
              styles.action,
              actionLockedHint !== undefined && styles.tabLocked,
              pressed && styles.actionPressed,
            ]}>
            <View style={styles.actionFill}>
              <BrandGradient />
            </View>
            <Icon name="plus" />
          </Pressable>
        </View>
        {routes.slice(actionIndex).map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Floats over the screen (as in the design) so content and backdrop run edge-to-edge behind it.
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  tab: {
    width: 64,
    alignItems: 'center',
    gap: 4,
  },
  tabLocked: {
    opacity: 0.4,
  },
  action: {
    width: 40,
    height: 40,
    borderRadius: radii.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.brand,
  },
  actionFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.xxl,
    overflow: 'hidden',
  },
  actionPressed: {
    transform: [{ scale: 0.95 }],
  },
});
