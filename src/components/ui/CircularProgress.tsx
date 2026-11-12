import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { brandGradient, colors } from '@/theme';
import { clamp01 } from '@/utils/format';

import { AppText } from './AppText';
import { FillMask } from './FillMask';

type Props = {
  /** 0–1 */
  progress: number;
  size?: number;
  /** Ring thickness; defaults to the design ratio (6.72 on a 48 ring). */
  thickness?: number;
  showLabel?: boolean;
};

/** Filled annular sector starting at 12 o'clock, sweeping clockwise. */
function sectorPath(size: number, thickness: number, progress: number) {
  const c = size / 2;
  const R = c;
  const r = c - thickness;
  const angle = progress * 2 * Math.PI;
  const largeArc = progress > 0.5 ? 1 : 0;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return [
    `M ${c} ${c - R}`,
    `A ${R} ${R} 0 ${largeArc} 1 ${c + R * sin} ${c - R * cos}`,
    `L ${c + r * sin} ${c - r * cos}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${c} ${c - r}`,
    'Z',
  ].join(' ');
}

export function CircularProgress({ progress, size = 48, thickness = size * 0.14, showLabel = true }: Props) {
  const id = `ring-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const value = clamp01(progress);
  const percent = Math.round(value * 100);
  const strokeCenterRadius = size / 2 - thickness / 2;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={id} gradientUnits="userSpaceOnUse" x1={size * 0.06} y1={0} x2={size * 0.82} y2={size}>
            <Stop offset={brandGradient.locations[0]} stopColor={brandGradient.colors[0]} />
            <Stop offset={brandGradient.locations[1]} stopColor={brandGradient.colors[1]} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={strokeCenterRadius}
          stroke={colors.ringTrack}
          strokeWidth={thickness}
          fill="none"
        />
        {value >= 1 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={strokeCenterRadius}
            stroke={`url(#${id})`}
            strokeWidth={thickness}
            fill="none"
          />
        ) : value > 0 ? (
          <Path d={sectorPath(size, thickness, value)} fill={`url(#${id})`} />
        ) : null}
      </Svg>
      {showLabel ? (
        <View style={StyleSheet.absoluteFill}>
          <FillMask style={[styles.label, { width: size, height: size }]}>
            <AppText variant="labelBold">{`${percent}%`}</AppText>
          </FillMask>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
