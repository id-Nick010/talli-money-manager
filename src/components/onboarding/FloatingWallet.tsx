import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useReduceMotion } from '@/components/ui';
import { spacing } from '@/theme';

const WALLET_IMAGE = require('@/assets/images/onboarding-wallet.png');

/**
 * The Figma asset is a single 1264×839 render with the wallet and three diamonds baked in. Each piece
 * is shown through its own window onto that image (rects are in source pixels), so they can move
 * independently without editing the asset.
 */
const SOURCE = { width: 1264, height: 839 };
/** Figma draws the render 351pt wide. */
const SCALE = 351.03 / SOURCE.width;

type Rect = { x0: number; y0: number; x1: number; y1: number };

/** The wallet wraps around the top-left diamond, so it's cut as two windows that overlap slightly. */
const WALLET_BOUNDS: Rect = { x0: 560, y0: 156, x1: 1060, y1: 632 };
const WALLET_PARTS: Rect[] = [
  { x0: 612, y0: 156, x1: 1060, y1: 632 },
  { x0: 560, y0: 240, x1: 616, y1: 632 },
];
const DIAMONDS: Rect[] = [
  { x0: 530, y0: 136, x1: 614, y1: 238 },
  { x0: 1082, y0: 200, x1: 1180, y1: 320 },
  { x0: 432, y0: 500, x1: 528, y1: 616 },
];

/** Figma's illustration frame height. */
const STAGE_HEIGHT = 184;
const ORBIT_MS = 9000;
const FLOAT_MS = 1600;
const ORBIT_RY = 30;
const ORBIT_MAX_RX = 140;
/** The orbit tilts with the wallet. */
const ORBIT_TILT = (8 * Math.PI) / 180;
/** Diamonds shrink and dim as they pass behind the wallet. */
const DEPTH_SCALE = { back: 0.7, front: 1.05 };
const DEPTH_OPACITY = { back: 0.75, front: 1 };
const ORBIT_SAMPLES = 48;

function Cutout({ rect, origin }: { rect: Rect; origin: { x: number; y: number } }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: (rect.x0 - origin.x) * SCALE,
        top: (rect.y0 - origin.y) * SCALE,
        width: (rect.x1 - rect.x0) * SCALE,
        height: (rect.y1 - rect.y0) * SCALE,
        overflow: 'hidden',
      }}>
      <Image
        source={WALLET_IMAGE}
        contentFit="fill"
        style={{
          position: 'absolute',
          left: -rect.x0 * SCALE,
          top: -rect.y0 * SCALE,
          width: SOURCE.width * SCALE,
          height: SOURCE.height * SCALE,
        }}
      />
    </View>
  );
}

const size = (rect: Rect) => ({ width: (rect.x1 - rect.x0) * SCALE, height: (rect.y1 - rect.y0) * SCALE });

/** Samples a tilted ellipse so Animated can trace it with plain interpolation. */
function orbitPath(rx: number) {
  const inputRange: number[] = [];
  const x: number[] = [];
  const y: number[] = [];
  const scale: number[] = [];
  const opacity: number[] = [];
  for (let i = 0; i <= ORBIT_SAMPLES; i++) {
    const t = i / ORBIT_SAMPLES;
    const angle = t * 2 * Math.PI;
    const ex = rx * Math.cos(angle);
    const ey = ORBIT_RY * Math.sin(angle);
    // 0 at the back (top of the ellipse), 1 at the front (bottom).
    const depth = (Math.sin(angle) + 1) / 2;
    inputRange.push(t);
    x.push(ex * Math.cos(ORBIT_TILT) - ey * Math.sin(ORBIT_TILT));
    y.push(ex * Math.sin(ORBIT_TILT) + ey * Math.cos(ORBIT_TILT));
    scale.push(DEPTH_SCALE.back + depth * (DEPTH_SCALE.front - DEPTH_SCALE.back));
    opacity.push(DEPTH_OPACITY.back + depth * (DEPTH_OPACITY.front - DEPTH_OPACITY.back));
  }
  return { inputRange, x, y, scale, opacity };
}

type DiamondProps = {
  rect: Rect;
  index: number;
  layer: 'front' | 'back';
  orbit: Animated.Value;
  float: Animated.Value;
  path: ReturnType<typeof orbitPath>;
};

function Diamond({ rect, index, layer, orbit, float, path }: DiamondProps) {
  const { width, height } = size(rect);
  // Spread the three diamonds evenly around the orbit.
  const progress = Animated.modulo(Animated.add(orbit, index / DIAMONDS.length), 1);
  const along = (outputRange: number[]) => progress.interpolate({ inputRange: path.inputRange, outputRange });
  // Each diamond is drawn twice, behind and in front of the wallet. They swap at the sides of the
  // orbit, where the diamond is clear of the wallet, so it reads as circling around it.
  const visible = progress.interpolate({
    inputRange: [0, 0.5, 0.5001, 1],
    outputRange: layer === 'front' ? [1, 1, 0, 0] : [0, 0, 1, 1],
  });
  const sway = index % 2 === 0 ? 12 : -12;

  return (
    <Animated.View
      style={[
        styles.anchor,
        {
          opacity: Animated.multiply(visible, along(path.opacity)),
          transform: [
            { translateX: along(path.x) },
            { translateY: along(path.y) },
            { scale: along(path.scale) },
            { rotate: float.interpolate({ inputRange: [0, 1], outputRange: [`${-sway}deg`, `${sway}deg`] }) },
          ],
        },
      ]}>
      <View style={{ position: 'absolute', left: -width / 2, top: -height / 2, width, height }}>
        <Cutout rect={rect} origin={{ x: rect.x0, y: rect.y0 }} />
      </View>
    </Animated.View>
  );
}

/** The onboarding wallet, bobbing gently while its diamonds orbit around it. */
export function FloatingWallet() {
  const { width: screenWidth } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const [orbit] = useState(() => new Animated.Value(0));
  const [float] = useState(() => new Animated.Value(0.5));

  // Keep the orbit inside the screen's side margins on narrow phones.
  const rx = Math.min(ORBIT_MAX_RX, (screenWidth - spacing.screenX * 2) / 2 - 20);
  const path = useMemo(() => orbitPath(rx), [rx]);

  useEffect(() => {
    if (reduceMotion) return;
    const ease = Easing.inOut(Easing.sin);
    const loops = [
      Animated.loop(Animated.timing(orbit, { toValue: 1, duration: ORBIT_MS, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(
        Animated.sequence([
          Animated.timing(float, { toValue: 1, duration: FLOAT_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(float, { toValue: 0, duration: FLOAT_MS, easing: ease, useNativeDriver: true }),
        ]),
      ),
    ];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [reduceMotion, orbit, float]);

  const wallet = size(WALLET_BOUNDS);
  const diamonds = (layer: 'front' | 'back') =>
    DIAMONDS.map((rect, index) => (
      <Diamond key={index} rect={rect} index={index} layer={layer} orbit={orbit} float={float} path={path} />
    ));

  return (
    <View style={styles.stage} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {diamonds('back')}
      <Animated.View
        style={[
          styles.anchor,
          {
            transform: [
              { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [4, -6] }) },
              { rotate: float.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] }) },
            ],
          },
        ]}>
        <View style={{ position: 'absolute', left: -wallet.width / 2, top: -wallet.height / 2, ...wallet }}>
          {WALLET_PARTS.map((rect, index) => (
            <Cutout key={index} rect={rect} origin={{ x: WALLET_BOUNDS.x0, y: WALLET_BOUNDS.y0 }} />
          ))}
        </View>
      </Animated.View>
      {diamonds('front')}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'stretch',
    height: STAGE_HEIGHT,
  },
  /** Zero-size point at the stage's centre that each layer is positioned around. */
  anchor: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
});
