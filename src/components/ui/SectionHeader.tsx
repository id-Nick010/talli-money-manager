import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, type ColorToken } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  title: string;
  onPress?: () => void;
  /** Short status text on the right (e.g. "2 In progress"). Replaces the chevron when set. */
  meta?: string;
  metaColor?: ColorToken;
  /** Short brand-colored pill on the right (e.g. "0 linked"). Replaces the chevron when set. */
  badge?: string;
  /** Show the "see all" chevron. Defaults to showing it when the header is tappable. */
  showChevron?: boolean;
};

export function SectionHeader({
  title,
  onPress,
  meta,
  metaColor = 'textSecondary',
  badge,
  showChevron = !!onPress,
}: Props) {
  const status = meta ?? badge;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'header'}
      accessibilityLabel={onPress ? `${title}, see all` : status ? `${title}, ${status}` : title}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <AppText variant="sectionTitle" numberOfLines={1}>
        {title}
      </AppText>
      {meta ? (
        <AppText variant="labelSemibold" color={metaColor} numberOfLines={1}>
          {meta}
        </AppText>
      ) : badge ? (
        <View style={styles.badge}>
          <AppText variant="microSemibold" color="brand" numberOfLines={1}>
            {badge}
          </AppText>
        </View>
      ) : showChevron ? (
        <Icon name="chevronRight" />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.brandTint,
  },
});
