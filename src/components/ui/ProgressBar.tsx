import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';
import { clamp01 } from '@/utils/format';

import { BrandGradient } from './BrandGradient';

type Props = {
  /** 0–1 */
  progress: number;
  height?: number;
  /** Track colour; defaults to the neutral track. */
  trackColor?: string;
  /** Smallest fill width in points, so an empty bar still shows where it starts. */
  minFill?: number;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ progress, height = 6, trackColor = colors.track, minFill = 0, style }: Props) {
  const value = clamp01(progress);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }, style]}>
      <View style={[styles.fill, { width: `${value * 100}%`, minWidth: minFill, borderRadius: height / 2 }]}>
        <BrandGradient />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
});
