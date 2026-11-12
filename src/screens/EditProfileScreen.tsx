import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { ProfileField, ProfileInput, profileInputStyle } from '@/components/settings';
import { AppText, Card, DatePickerField, Icon, PageHeader, ScreenBackground, SheetButton } from '@/components/ui';
import { updateProfile, useProfile } from '@/data/profileStore';
import { colors, radii, shadows, spacing } from '@/theme';
import { formatLongDate } from '@/utils/date';

export function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const profile = useProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [birthday, setBirthday] = useState(profile.birthday);

  const canSave = name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(email.trim());

  const save = () => {
    if (!canSave) return;
    updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim(), birthday });
    router.back();
  };

  return (
    <View style={styles.screen}>
      {/* Opaque backdrop so the settings page underneath in the stack doesn't show through. */}
      <ScreenBackground />

      <View style={{ marginTop: insets.top }}>
        <PageHeader title="Edit Profile" actionLabel="Save" onPressAction={save} actionDisabled={!canSave} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 14 }]}>
        {/* TODO: open the photo picker once a photo source (camera / library) is decided. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          style={({ pressed }) => [styles.photoEditor, pressed && styles.pressed]}>
          <View style={styles.photoSlot}>
            <View style={styles.photoFrame}>
              <Image source={profile.photo} contentFit="cover" style={styles.photo} accessibilityIgnoresInvertColors />
            </View>
            <View style={styles.cameraBadge}>
              <Icon name="camera" />
            </View>
          </View>
          <AppText variant="linkBold" color="brandDeep">
            Change profile photo
          </AppText>
        </Pressable>

        <Card radius={radii.xxl} shadow="settingsCard" style={styles.form}>
          <ProfileField label="Full name">
            <ProfileInput
              icon="fieldUser"
              value={name}
              onChangeText={setName}
              accessibilityLabel="Full name"
              autoComplete="name"
              textContentType="name"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </ProfileField>
          <ProfileField label="Email address">
            <ProfileInput
              icon="fieldMail"
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Email address"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </ProfileField>
          <ProfileField label="Mobile number">
            <ProfileInput
              icon="fieldPhone"
              value={phone}
              onChangeText={setPhone}
              accessibilityLabel="Mobile number"
              autoComplete="tel"
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
            />
          </ProfileField>
          <ProfileField label="Date of birth">
            <DatePickerField
              label="Date of birth"
              icon="fieldCalendar"
              value={birthday}
              onChange={setBirthday}
              maxDate={new Date()}
              formatValue={formatLongDate}
              style={profileInputStyle.input}
            />
          </ProfileField>
        </Card>

        <View style={styles.note}>
          <Icon name="infoBrand" />
          <AppText variant="note" color="brandDeep" style={styles.noteText}>
            Your verified email helps keep account recovery secure.
          </AppText>
        </View>

        <SheetButton label="Update profile" icon="checkSm" disabled={!canSave} onPress={save} style={styles.submit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    gap: 14,
    paddingTop: 10,
    paddingHorizontal: spacing.screenX,
  },
  photoEditor: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoSlot: {
    width: 82,
    height: 82,
  },
  photoFrame: {
    width: 82,
    height: 82,
    borderRadius: radii.pill,
    backgroundColor: colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
  },
  // Sits on the frame's bottom-right corner, as in Figma.
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 12,
    // Figma keeps the 1pt stroke out of the padding; React Native pads inside the border.
    padding: 16 - 1,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.brandMint,
  },
  noteText: {
    flex: 1,
  },
  submit: {
    height: 48,
    paddingVertical: 0,
    boxShadow: shadows.buttonLg,
  },
});
