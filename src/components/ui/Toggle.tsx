import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, shadows } from '@/theme';

import { BrandGradient } from './BrandGradient';

const WIDTH = 44;
const HEIGHT = 24;
const THUMB = 18;
const INSET = (HEIGHT - THUMB) / 2;
const TRAVEL = WIDTH - THUMB - INSET * 2;
/** Figma's track gradient handles, in the track's bounding box. */
const TRACK_GRADIENT = { x1: 0.06, y1: 0, x2: 0.3644, y2: 1.3463 };

type Props = {
  value: boolean;
  /** Track colour when on: the brand gradient, or flat brand green (Privacy & Security). */
  fill?: 'gradient' | 'solid';
  /** Omit when the toggle sits in a row that handles the press itself. */
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

/** Brand-green on/off switch. */
export function Toggle({ value, fill = 'gradient', onChange, disabled = false, accessibilityLabel }: Props) {
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, { toValue: value ? 1 : 0, duration: 160, useNativeDriver: true }).start();
  }, [progress, value]);

  const track = (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fill === 'solid' && styles.fillSolid, { opacity: progress }]}>
        {fill === 'gradient' ? <BrandGradient vector={TRACK_GRADIENT} locations={[0, 1]} /> : null}
      </Animated.View>
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] }) }] },
        ]}
      />
    </View>
  );

  if (!onChange) return <View style={disabled && styles.disabled}>{track}</View>;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onChange(!value)}
      style={disabled && styles.disabled}>
      {track}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  // Clipped separately so the thumb's shadow can spill below the track, as in Figma.
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fillSolid: {
    backgroundColor: colors.brand,
  },
  thumb: {
    position: 'absolute',
    top: INSET,
    left: INSET,
    width: THUMB,
    height: THUMB,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    boxShadow: shadows.thumb,
  },
  disabled: {
    opacity: 0.5,
  },
});
