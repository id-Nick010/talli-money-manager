import { router } from 'expo-router';
import { Tabs, type BottomTabNavigationOptions } from 'expo-router/tabs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';

import { BottomTabBar, type TabMeta } from '@/components/navigation/BottomTabBar';
import { settleTabDrag, TAB_TRANSITION, TabSwipeArea } from '@/components/navigation/TabSwipeArea';
import { useLockedTabs } from '@/components/navigation/useLockedTabs';
import { ScreenBackground } from '@/components/ui';
import { useAccounts } from '@/data/accountsStore';

type SceneStyleInterpolator = NonNullable<BottomTabNavigationOptions['sceneStyleInterpolator']>;

const TABS: Record<string, TabMeta> = {
  '(home)': { label: 'Dashboard', icon: 'home' },
  bills: { label: 'Bills', icon: 'notebook' },
  accounts: { label: 'Accounts', icon: 'wallet' },
  profile: { label: 'Profile', icon: 'userSettings' },
};

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const [drag] = useState(() => new Animated.Value(0));
  const locked = useLockedTabs();
  // Every transaction belongs to an account, so adding one waits until an account exists.
  const hasAccount = useAccounts().length > 0;

  // Swipe gestures are built once per screen, so they read the latest locks through a ref.
  const lockedRef = useRef(locked);
  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);
  const isLocked = useCallback((name: string) => lockedRef.current.has(name), []);

  // Pages sit side by side in tab order, one screen width apart, like a pager. Every page also
  // follows the shared swipe offset, so the neighbouring page is attached while dragging.
  const slide = useMemo<SceneStyleInterpolator>(
    () =>
      ({ current }) => ({
        sceneStyle: {
          transform: [
            {
              translateX: Animated.add(
                current.progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [-width, 0, width] }),
                drag,
              ),
            },
          ],
        },
      }),
    [width, drag],
  );

  return (
    <View style={styles.root}>
      {/* One fixed backdrop behind all pages; only the pages' content slides when swiping. */}
      <ScreenBackground />
      <Tabs
        // Keep every page mounted and attached so neighbours are already rendered when a swipe begins.
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          lazy: false,
          // Transparent pages let the shared backdrop show through.
          sceneStyle: styles.scene,
          sceneStyleInterpolator: slide,
          transitionSpec: { animation: 'timing', config: TAB_TRANSITION },
        }}
        // Hand the drag offset back on the exact frame the page slide starts, so a released swipe
        // continues as one motion.
        screenListeners={{ transitionStart: () => settleTabDrag(drag) }}
        screenLayout={({ navigation, children }) => (
          <TabSwipeArea navigation={navigation} drag={drag} isLocked={isLocked}>
            {children}
          </TabSwipeArea>
        )}
        tabBar={(props) => (
          <BottomTabBar
            {...props}
            tabs={TABS}
            actionIndex={2}
            locked={locked}
            onPressAction={() => router.push('/add-transaction')}
            actionLockedHint={hasAccount ? undefined : 'Available after you add an account'}
          />
        )}>
        <Tabs.Screen name="(home)" />
        <Tabs.Screen name="bills" />
        <Tabs.Screen name="accounts" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scene: {
    backgroundColor: 'transparent',
  },
});
