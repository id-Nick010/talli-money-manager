import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Icon } from '@/components/ui';
import { colors, radii } from '@/theme';

/** Figma keeps strokes out of the 8pt padding; React Native pads inside the border. */
const PADDING = 8;
const STROKE = 1;
const STROKE_SELECTED = 1.5;
/** Figma's 153×168.68 dashboard preview, kept in proportion as the card width changes. */
const PREVIEW_ASPECT = 153 / 168.68;

type Props = {
  title: string;
  tagline: string;
  /** Full-screen dashboard screenshot; the top half shows in the card. */
  preview: ImageSource | number;
  selected: boolean;
  onPress: () => void;
};

/** A theme card on the appearance step: dashboard preview, name and radio. */
export function AppearanceChoice({ title, tagline, preview, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}, ${tagline}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}>
      <View style={styles.preview}>
        {/* Figma scales the full-screen shot to the preview's width and shows its top half. */}
        <Image
          source={preview}
          contentFit="cover"
          contentPosition="top"
          style={StyleSheet.absoluteFill}
          accessibilityIgnoresInvertColors
        />
      </View>
      <View style={styles.details}>
        <View style={styles.copy}>
          <AppText variant="titleSm" numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="micro" color={selected ? 'brand' : 'textSecondary'} numberOfLines={1}>
            {selected ? `Selected · ${tagline}` : tagline}
          </AppText>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <Icon name="onboardingCheck" /> : null}
        </View>
      </View>
    </Pressable>
  );
}

/** Faded, non-interactive card for a theme that isn't available yet. */
export function AppearancePlaceholder({ title }: { title: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${title}, coming soon`}
      accessibilityState={{ disabled: true }}
      style={[styles.card, styles.placeholder]}>
      <View style={[styles.preview, styles.placeholderPreview]}>
        <AppText variant="previewPlaceholder" color="textSecondary">
          Preview coming soon
        </AppText>
      </View>
      <View style={styles.details}>
        <View style={styles.copy}>
          <AppText variant="titleSm" numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="micro" color="textSecondary">
            Coming soon
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 6,
    padding: PADDING - STROKE,
    borderRadius: radii.xxl,
    borderWidth: STROKE,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardSelected: {
    padding: PADDING - STROKE_SELECTED,
    borderWidth: STROKE_SELECTED,
    borderColor: colors.brand,
    backgroundColor: colors.surfaceMint,
  },
  pressed: {
    opacity: 0.85,
  },
  preview: {
    aspectRatio: PREVIEW_ASPECT,
    borderRadius: 10.08,
    overflow: 'hidden',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: STROKE,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  radioSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  placeholder: {
    backgroundColor: colors.surfaceMint,
    opacity: 0.7,
  },
  placeholderPreview: {
    justifyContent: 'center',
    padding: 8,
    borderRadius: 14,
    backgroundColor: colors.surfacePlaceholder,
  },
});
