import { useMemo, type ReactNode } from 'react';
import { Animated, Easing, PanResponder, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

import { HorizontalGestureContext } from '@/components/ui';

/** The slice of a tab screen's `navigation` prop this component needs. */
type TabNavigation = {
  getState: () => { index: number; routes: readonly { name: string; state?: { index?: number } }[] };
  navigate: (name: string) => void;
};

type Props = {
  navigation: TabNavigation;
  /**
   * Drag offset shared by every tab scene (the navigator's scene interpolator adds it to each page's
   * position), so neighbouring pages move with the finger side by side.
   */
  drag: Animated.Value;
  /** Tabs that can't be opened yet; swiping treats them like the edge of the pager. */
  isLocked?: (name: string) => boolean;
  children: ReactNode;
};

/**
 * Must match the tab navigator's `transitionSpec`, so the drag offset settles with the page slide.
 * A gentle ease-out keeps the hand-off from the finger close to the finger's own speed.
 */
export const TAB_TRANSITION = { duration: 300, easing: Easing.out(Easing.quad) };

/** The tab navigator animates scenes natively except on web; the shared offset must use the same driver. */
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

/** Horizontal movement before the swipe takes over (keeps taps and vertical scrolls working). */
const SWIPE_SLOP = 12;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 0.5;
/** Drag damping when there's no tab to swipe to (first/last tab). */
const EDGE_RESISTANCE = 0.2;

/**
 * Eases the shared drag offset back to 0. For a tab change, call it on the navigator's
 * `transitionStart` event (see the tabs layout) so it starts on the same frame as the page slide.
 */
export function settleTabDrag(drag: Animated.Value) {
  Animated.timing(drag, { toValue: 0, ...TAB_TRANSITION, useNativeDriver: USE_NATIVE_DRIVER }).start();
}

/**
 * Builds the swipe gesture for one tab screen. Kept outside the component because it holds
 * per-touch state (`claimed`) that the gesture callbacks update.
 */
function createTabSwipe(
  navigation: TabNavigation,
  drag: Animated.Value,
  width: number,
  isLocked: (name: string) => boolean,
) {
  // Whether the current touch started on a horizontal carousel; cleared when the touch ends.
  let claimed = false;

  const neighbour = (direction: 1 | -1) => {
    const { index, routes } = navigation.getState();
    const route = routes[index + direction];
    return route && !isLocked(route.name) ? route : undefined;
  };

  // The gesture is only claimed after SWIPE_SLOP of movement; measuring from there (instead of from
  // the touch-down point) stops the pages jumping by the slop distance on the first frame.
  const follow = (dx: number) => (dx > 0 ? Math.max(0, dx - SWIPE_SLOP) : Math.min(0, dx + SWIPE_SLOP));

  // A tab with its own stack (e.g. Bills → bill detail) that has a page pushed leaves horizontal
  // swipes to the stack's back gesture.
  const isNested = () => {
    const { index, routes } = navigation.getState();
    return (routes[index]?.state?.index ?? 0) > 0;
  };

  const responder = PanResponder.create({
    // Only claim clearly horizontal drags that didn't start on a carousel; vertical ones stay with
    // the screen's ScrollView.
    onMoveShouldSetPanResponder: (_, { dx, dy }) =>
      !claimed && Math.abs(dx) > SWIPE_SLOP && Math.abs(dx) > Math.abs(dy) * 1.5 && !isNested(),
    onPanResponderGrant: () => drag.stopAnimation(),
    onPanResponderMove: (_, { dx }) => {
      const offset = follow(dx);
      const hasTarget = neighbour(offset < 0 ? 1 : -1) != null;
      drag.setValue(hasTarget ? Math.max(-width, Math.min(width, offset)) : offset * EDGE_RESISTANCE);
    },
    onPanResponderRelease: (_, { dx, vx }) => {
      const direction = dx < -SWIPE_DISTANCE || vx < -SWIPE_VELOCITY ? 1 : dx > SWIPE_DISTANCE || vx > SWIPE_VELOCITY ? -1 : 0;
      const target = direction === 0 ? undefined : neighbour(direction);
      if (target) {
        // Don't settle here: the layout settles on `transitionStart`, the frame the navigator's page
        // slide begins. Settling now would pull the pages back before the slide starts (a bounce).
        navigation.navigate(target.name);
      } else {
        settleTabDrag(drag);
      }
    },
    onPanResponderTerminate: () => settleTabDrag(drag),
  });

  return {
    panHandlers: responder.panHandlers,
    /** Called by a carousel's onTouchStart: this touch belongs to the carousel. */
    claim: () => {
      claimed = true;
    },
    /** Called when every finger lifts, so the next touch starts unclaimed. */
    release: () => {
      claimed = false;
    },
  };
}

/**
 * Wraps a tab screen so a horizontal swipe moves to the neighbouring tab: right-to-left goes to the
 * next tab, left-to-right to the previous one. Pages track the finger through the shared `drag` value.
 *
 * Horizontal carousels (`HorizontalList`) claim touches that start on them through
 * `HorizontalGestureContext`, so only swipes that start outside them switch tabs.
 */
const NEVER_LOCKED = () => false;

export function TabSwipeArea({ navigation, drag, isLocked = NEVER_LOCKED, children }: Props) {
  const { width } = useWindowDimensions();
  const swipe = useMemo(
    () => createTabSwipe(navigation, drag, width, isLocked),
    [navigation, drag, width, isLocked],
  );

  return (
    <HorizontalGestureContext.Provider value={swipe.claim}>
      <View {...swipe.panHandlers} onTouchEnd={swipe.release} onTouchCancel={swipe.release} style={styles.fill}>
        {children}
      </View>
    </HorizontalGestureContext.Provider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
