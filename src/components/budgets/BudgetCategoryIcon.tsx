import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { TileArtwork } from '@/components/ui';
import { colors } from '@/theme';

/** The icon is the 40pt picker tile shrunk to 36pt, so its artwork shifts up and left by 2pt. */
const INSET = 2;

type Props = {
  artwork?: TileArtwork;
};

/** 36pt rounded category illustration used in budget rows. */
export function BudgetCategoryIcon({ artwork }: Props) {
  return (
    <View style={styles.icon}>
      {artwork ? (
        <View
          style={[
            styles.frame,
            { left: artwork.x - INSET, top: artwork.y - INSET, width: artwork.width, height: artwork.height },
          ]}>
          <Image
            source={artwork.source}
            contentFit="fill"
            style={{
              position: 'absolute',
              left: artwork.image.left * artwork.width,
              top: artwork.image.top * artwork.height,
              width: artwork.image.width * artwork.width,
              height: artwork.image.height * artwork.height,
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.successTint,
  },
  frame: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
