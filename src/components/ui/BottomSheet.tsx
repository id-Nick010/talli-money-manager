import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, shadows, spacing } from '@/theme';

import { AppText } from './AppText';
import { BrandGradient } from './BrandGradient';
import { Icon, type IconName } from './Icon';

type Props = {
  title: string;
  /** Called once the dismiss animation finishes. Keep it referentially stable. */
  onClose: () => void;
  /** Vertical gap between the header and every section of the sheet. */
  gap?: number;
  /** Bottom padding used when the device's safe-area inset is smaller. */
  minBottomPadding?: number;
  /** Padding around the 12pt close glyph. */
  closePadding?: number;
  /** Shows a back button before a centred title, for multi-step sheets. */
  onBack?: () => void;
  /** Receives `close`, which plays the dismiss animation before calling `onClose`. */
  children: (close: () => void) => ReactNode;
};

const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 0.8;

/** Modal bottom sheet with a dimmed backdrop, slide-up entrance and drag-to-dismiss header. */
export function BottomSheet({
  title,
  onClose,
  gap = 12,
  minBottomPadding = 20,
  closePadding = 4,
  onBack,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const [translateY] = useState(() => new Animated.Value(windowHeight));
  const [backdrop] = useState(() => new Animated.Value(0));
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 24, stiffness: 240, useNativeDriver: true }),
    ]).start();
  }, [backdrop, translateY]);

  // Memoised so the drag responder below stays stable across renders (pass a stable `onClose`).
  const close = useCallback(() => {
    setClosing(true);
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: windowHeight,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [backdrop, translateY, windowHeight, onClose]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dy, dx }) => dy > 4 && Math.abs(dy) > Math.abs(dx),
        onPanResponderMove: (_, { dy }) => translateY.setValue(Math.max(0, dy)),
        onPanResponderRelease: (_, { dy, vy }) => {
          if (dy > DISMISS_DISTANCE || vy > DISMISS_VELOCITY) {
            close();
          } else {
            Animated.spring(translateY, { toValue: 0, damping: 24, stiffness: 240, useNativeDriver: true }).start();
          }
        },
      }),
    [translateY, close],
  );

  return (
    // Once dismissing, ignore further touches so the close animation can't be re-triggered.
    <View style={StyleSheet.absoluteFill} pointerEvents={closing ? 'none' : 'auto'}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: backdrop }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <KeyboardAvoidingView behavior="padding" style={styles.keyboard} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { gap, paddingBottom: Math.max(minBottomPadding, insets.bottom), transform: [{ translateY }] },
          ]}>
          <View {...panResponder.panHandlers} style={{ gap }}>
            <View style={styles.handleWrapper}>
              <View style={styles.handle} />
            </View>
            <View style={[styles.titleRow, onBack && styles.titleRowWithBack]}>
              {onBack ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back"
                  hitSlop={10}
                  onPress={onBack}
                  style={({ pressed }) => pressed && styles.pressed}>
                  <Icon name="sheetBack" />
                </Pressable>
              ) : null}
              <AppText
                variant="sheetTitle"
                accessibilityRole="header"
                numberOfLines={1}
                style={onBack && styles.centeredTitle}>
                {title}
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={10}
                onPress={close}
                style={({ pressed }) => [styles.close, { padding: closePadding }, pressed && styles.pressed]}>
                <Icon name="close" />
              </Pressable>
            </View>
          </View>

          {children(close)}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

/**
 * The CTA's Figma gradient (≈170.5°, stops 6.48% → 114.5%) expressed in the button's own bounding
 * box, with the end handle pushed out so the >100% stop lands on offset 1.
 */
const CTA_GRADIENT = {
  vector: { x1: 0.4785, y1: -0.651, x2: 0.5277, y2: 1.985 },
  locations: [0.0566, 1] as const,
};

type SheetButtonProps = {
  label: string;
  /** Shown before the label. */
  icon?: IconName;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Full-width gradient submit button at the bottom of a sheet. */
export function SheetButton({ label, icon, disabled = false, onPress, style }: SheetButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.cta, style, disabled && styles.ctaDisabled, pressed && styles.ctaPressed]}>
      <View style={styles.ctaFill}>
        <BrandGradient vector={CTA_GRADIENT.vector} locations={CTA_GRADIENT.locations} />
      </View>
      {icon ? <Icon name={icon} /> : null}
      <AppText variant="button" color="white">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: colors.scrim,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: 8,
    paddingHorizontal: spacing.screenX,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    boxShadow: shadows.sheet,
  },
  handleWrapper: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRowWithBack: {
    gap: 12,
  },
  centeredTitle: {
    flex: 1,
    // Figma leaves 15pt (not 12) between the centred title block and the close button.
    marginRight: 3,
    textAlign: 'center',
  },
  close: {
    borderRadius: 10,
    backgroundColor: colors.track,
  },
  pressed: {
    opacity: 0.6,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    boxShadow: shadows.button,
  },
  ctaFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
  },
});
