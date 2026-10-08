import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

const TILE_SIZE = 40;

/**
 * Where an illustration sits on the 40pt tile, straight from Figma: a clipping frame (in points)
 * and the image's rect inside it (as fractions of the frame), so artwork can be cropped and zoomed.
 */
export type TileArtwork = {
  source: number;
  x: number;
  y: number;
  width: number;
  height: number;
  image: { left: number; top: number; width: number; height: number };
};

type Props = {
  label: string;
  artwork: TileArtwork;
  selected: boolean;
  onPress: () => void;
  /** `checkbox` adds a check badge for multi-select pickers; `radio` for single choice. */
  mode?: 'radio' | 'checkbox';
};

/** Illustrated choice tile used by the add-account and budget-setup pickers. */
export function CategoryTile({ label, artwork, selected, onPress, mode = 'radio' }: Props) {
  const { source, x, y, width, height, image } = artwork;

  return (
    <Pressable
      accessibilityRole={mode}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <View style={styles.tileBox}>
        {/* The selection stroke sits on its own layer so the artwork never shifts when selected. */}
        <View style={[styles.tile, selected && styles.tileSelected]} />
        <View style={[styles.frame, { left: x, top: y, width, height }]}>
          <Image
            source={source}
            contentFit="fill"
            style={{
              position: 'absolute',
              left: image.left * width,
              top: image.top * height,
              width: image.width * width,
              height: image.height * height,
            }}
          />
        </View>
        {mode === 'checkbox' && selected ? (
          <View style={styles.check}>
            <Icon name="check" />
          </View>
        ) : null}
      </View>
      <AppText
        variant={selected ? 'microSemibold' : 'micro'}
        color={selected ? 'brand' : 'textSecondary'}
        style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 62,
    alignItems: 'center',
    gap: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  tileBox: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  tile: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    backgroundColor: colors.successSoft,
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: colors.brand,
  },
  frame: {
    position: 'absolute',
    overflow: 'hidden',
  },
  check: {
    position: 'absolute',
    top: 5,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  label: {
    alignSelf: 'stretch',
    lineHeight: 14,
    textAlign: 'center',
  },
});
