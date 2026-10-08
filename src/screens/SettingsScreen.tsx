import { router, useScrollToTop } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/components/navigation/BottomTabBar';
import { ProfileCard, SettingsGroup, SettingsRow } from '@/components/settings';
import { IconButton, ScreenHeader } from '@/components/ui';
import { signOut } from '@/data/authStore';
import { useProfile } from '@/data/profileStore';
import { spacing } from '@/theme';

const openEditProfile = () => router.push('/profile/edit');
const openNotifications = () => router.push('/profile/notifications');
const openPrivacySecurity = () => router.push('/profile/privacy-security');

// TODO: wire the remaining rows (and the header's help button) once their destination screens are designed.
export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const profile = useProfile();

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarInset + 24 }}>
        <ScreenHeader
          title="Profile & Settings"
          style={styles.header}
          actions={<IconButton icon="helpInfo" accessibilityLabel="About Talli" />}
        />

        <View style={styles.content}>
          <ProfileCard
            name={profile.name}
            email={profile.email}
            photo={profile.photo}
            verified={profile.verified}
            onPressEdit={openEditProfile}
          />

          <SettingsGroup title="Account">
            <SettingsRow
              icon="userPen"
              title="Edit Profile"
              subtitle="Personal details and photo"
              onPress={openEditProfile}
            />
            <SettingsRow
              icon="bell"
              title="Notifications"
              subtitle="Alerts and reminders"
              onPress={openNotifications}
            />
            <SettingsRow
              icon="shieldCheck"
              title="Privacy & Security"
              subtitle="Password, Face ID and data"
              onPress={openPrivacySecurity}
            />
          </SettingsGroup>

          <SettingsGroup title="Preferences">
            <SettingsRow icon="coins" title="Default currency" value={profile.currency} />
            <SettingsRow icon="palette" title="Appearance" value={profile.appearance} />
            <SettingsRow icon="circleHelp" title="Help & Support" subtitle="FAQs and contact support" />
          </SettingsGroup>

          <SettingsGroup>
            <SettingsRow icon="logOut" title="Sign out" destructive onPress={signOut} />
          </SettingsGroup>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma: this page's header bar is 56pt, shorter than the 73pt default.
  header: {
    height: 56,
  },
  content: {
    gap: 12,
    paddingTop: 10,
    paddingHorizontal: spacing.screenX,
  },
});
