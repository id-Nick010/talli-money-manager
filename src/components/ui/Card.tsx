import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radii, shadows } from '@/theme';

const BORDER_WIDTH = 1;

export type CardProps = ViewProps & {
  radius?: number;
  /** `null` for a flat, border-only card. */
  shadow?: keyof typeof shadows | null;
  /**
   * Decorative content rendered behind the card's children and clipped to its rounded corners
   * (e.g. artwork bleeding off the edge). Clipping happens on an inner layer so the drop shadow survives.
   */
  backdrop?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ radius = radii.lg, shadow = 'card', backdrop, style, children, ...rest }: CardProps) {
  return (
    <View {...rest} style={[styles.base, { borderRadius: radius, boxShadow: shadow ? shadows[shadow] : undefined }, style]}>
      {backdrop ? (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: radius - BORDER_WIDTH, overflow: 'hidden' }]}>
          {backdrop}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderWidth: BORDER_WIDTH,
    borderColor: colors.border,
  },
});
