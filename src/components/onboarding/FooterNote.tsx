import { StyleSheet, View } from 'react-native';

import { AppText, Icon } from '@/components/ui';

/** "You can change this later" line above an onboarding step's button. */
export function FooterNote({ children }: { children: string }) {
  return (
    <View style={styles.row}>
      <Icon name="refreshCw" />
      <AppText variant="onboardingNoteMd" color="brandInk" style={styles.text}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    flex: 1,
  },
});
