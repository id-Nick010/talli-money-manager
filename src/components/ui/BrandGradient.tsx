import { useId } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { brandGradient } from '@/theme';

/**
 * Gradient handles in the element's own bounding box (Figma's relative gradient), equivalent to
 * `linear-gradient(142.77deg, …)` on a square. Using `objectBoundingBox` keeps the gradient stretched
 * to the element exactly like Figma does, whatever its aspect ratio.
 */
export const BRAND_GRADIENT_VECTOR = { x1: 0.0758, y1: -0.0577, x2: 0.9242, y2: 1.0577 } as const;

type GradientVector = { x1: number; y1: number; x2: number; y2: number };

type Props = {
  style?: StyleProp<ViewStyle>;
  /** Overrides the gradient handles (bounding-box units) for elements whose Figma angle differs. */
  vector?: GradientVector;
  /** Overrides the stop offsets for the two brand colors. */
  locations?: readonly [number, number];
};

/** Fills its parent (absolutely positioned) with the Talli brand gradient. */
export function BrandGradient({ style, vector = BRAND_GRADIENT_VECTOR, locations = brandGradient.locations }: Props) {
  const id = `brand-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} gradientUnits="objectBoundingBox" {...vector}>
            <Stop offset={locations[0]} stopColor={brandGradient.colors[0]} />
            <Stop offset={locations[1]} stopColor={brandGradient.colors[1]} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
