import { useState, type ReactNode, type RefObject } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors, radii, shadows } from '@/theme';

/** Gap between the anchor and the popover, and the minimum margin to the screen edges. */
const OFFSET = 6;
const SCREEN_MARGIN = 16;

type Frame = { x: number; y: number; width: number; height: number };

type Props = {
  /** The field the popover hangs from. */
  anchor: RefObject<View | null>;
  visible: boolean;
  onClose: () => void;
  /** At least this wide; otherwise it matches the anchor's width. */
  minWidth?: number;
  children: ReactNode;
};

/**
 * Floating panel attached to a field (dropdown menus, the date picker). It opens below the field, or
 * above it when there isn't room, stays inside the screen, and closes on a tap outside.
 */
export function Popover({ anchor, visible, onClose, minWidth = 0, children }: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [frame, setFrame] = useState<Frame | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [wasVisible, setWasVisible] = useState(visible);

  // Forget the last placement when closed, so the next opening measures afresh.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (!visible) {
      setFrame(null);
      setContentHeight(null);
    }
  }

  const measureAnchor = () =>
    anchor.current?.measureInWindow((x, y, width, height) => setFrame({ x, y, width, height }));

  let position = null;
  if (frame) {
    const width = Math.min(Math.max(frame.width, minWidth), screenWidth - SCREEN_MARGIN * 2);
    const left = Math.min(Math.max(frame.x, SCREEN_MARGIN), screenWidth - SCREEN_MARGIN - width);
    const below = frame.y + frame.height + OFFSET;
    const above = frame.y - OFFSET - (contentHeight ?? 0);
    const fitsBelow = contentHeight === null || below + contentHeight <= screenHeight - SCREEN_MARGIN;
    const top = fitsBelow || above < SCREEN_MARGIN ? below : above;
    position = { left, top, width };
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onShow={measureAnchor}
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={StyleSheet.absoluteFill} />
      {position ? (
        <View
          onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
          // Hidden for the first frame while its height is measured, so it never jumps sides.
          style={[styles.popover, position, contentHeight === null && styles.measuring]}>
          {children}
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  popover: {
    position: 'absolute',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    boxShadow: shadows.popover,
  },
  measuring: {
    opacity: 0,
  },
});
