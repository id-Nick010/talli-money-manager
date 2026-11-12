import { useContext, type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { spacing } from '@/theme';

import { HorizontalGestureContext } from './HorizontalGestureContext';

/** Vertical room given to card shadows so the scroll view doesn't clip them; offset with negative margin. */
const SHADOW_BLEED = 16;

type Props = {
  children: ReactNode;
  gap?: number;
};

/** Edge-to-edge horizontal carousel aligned with the screen gutter. */
export function HorizontalList({ children, gap = spacing.cardGap }: Props) {
  // Touches that start on the carousel scroll it, and never swipe to another tab.
  const claimHorizontalGesture = useContext(HorizontalGestureContext);

  return (
    <ScrollView
      horizontal
      onTouchStart={claimHorizontalGesture ?? undefined}
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={[styles.content, { gap }]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginVertical: -SHADOW_BLEED,
  },
  content: {
    paddingHorizontal: spacing.screenX,
    paddingVertical: SHADOW_BLEED,
    alignItems: 'flex-start',
  },
});
