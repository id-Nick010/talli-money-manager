import MaskedView from '@react-native-masked-view/masked-view';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { BrandGradient } from './BrandGradient';

export type MaskFill = 'brand' | (string & {});

type Props = {
  /** The shape to paint (text, icon…). Only its alpha channel is used. */
  children: ReactNode;
  /** `'brand'` for the brand gradient, or any solid color. */
  fill?: MaskFill;
  /** Box the fill spans; children are laid out inside it. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Paints `children` with a gradient or solid fill (gradient text, recolorable icons).
 * The gradient spans the `style` box, so pass an explicit size when it should cover more than the shape.
 */
export function FillMask({ children, fill = 'brand', style }: Props) {
  return (
    <MaskedView
      maskElement={
        <View style={[styles.box, style]}>
          <View>{children}</View>
        </View>
      }>
      <View style={[styles.box, style]}>
        <View style={styles.hidden}>{children}</View>
        {fill === 'brand' ? (
          <BrandGradient />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
        )}
      </View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'transparent',
  },
  hidden: {
    opacity: 0,
  },
});
