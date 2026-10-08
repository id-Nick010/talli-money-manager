import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

import { AppText } from './AppText';

/** Explicit placement of the photo inside the circle, as percentages (mirrors a Figma image crop). */
export type AvatarCrop = { left: DimensionValue; top: DimensionValue; width: DimensionValue; height: DimensionValue };

export type AvatarData = {
  id: string;
  name: string;
  image?: ImageSource | number;
  crop?: AvatarCrop;
  /** Background for the initial when there is no photo. */
  color?: string;
};

type Props = AvatarData & {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({ name, image, crop, color = colors.success, size = 28, style }: Props) {
  const radius = size / 2;
  return (
    <View
      accessibilityLabel={name}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: radius, backgroundColor: image ? colors.surface : color },
        style,
      ]}>
      {image ? (
        <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
          <Image
            source={image}
            contentFit={crop ? 'fill' : 'cover'}
            style={crop ? { position: 'absolute', ...crop } : StyleSheet.absoluteFill}
          />
        </View>
      ) : (
        <AppText variant="avatarInitial" color="white">
          {name.charAt(0).toUpperCase()}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
