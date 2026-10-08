import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

/**
 * Soft mint gradient backdrop shared by the main screens. Rendered once behind the tab navigator so
 * it stays put while pages swipe over it.
 */
export function ScreenBackground() {
  return (
    <Image
      source={require('@/assets/images/home-background.png')}
      contentFit="cover"
      contentPosition="top"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
