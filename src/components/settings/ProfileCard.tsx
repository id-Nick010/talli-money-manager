import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Icon } from '@/components/ui';
import { colors, radii } from '@/theme';

type Props = {
  name: string;
  email: string;
  photo: ImageSource | number;
  verified?: boolean;
  onPressEdit?: () => void;
};

export function ProfileCard({ name, email, photo, verified = false, onPressEdit }: Props) {
  return (
    <Card radius={22} shadow={null} style={styles.card}>
      <View style={styles.avatarRing}>
        <Image source={photo} contentFit="cover" style={styles.photo} accessibilityIgnoresInvertColors />
      </View>

      <View style={styles.copy}>
        <AppText variant="profileName" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="caption" color="textSecondary" numberOfLines={1}>
          {email}
        </AppText>
        {verified ? (
          <View style={styles.badge}>
            <Icon name="shieldCheckSm" />
            <AppText variant="badgeBold" color="brandDeep">
              Verified member
            </AppText>
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
        hitSlop={4}
        onPress={onPressEdit}
        style={({ pressed }) => [styles.edit, pressed && styles.pressed]}>
        <Icon name="pencil" />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    // Figma keeps the 1pt stroke out of the padding; React Native pads inside the border.
    padding: 16 - 1,
  },
  avatarRing: {
    width: 66,
    height: 66,
    borderRadius: radii.pill,
    backgroundColor: colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 58,
    height: 58,
    borderRadius: radii.pill,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
    gap: 3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.brandMint,
  },
  edit: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
