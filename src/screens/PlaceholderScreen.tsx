import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.screen}>
      <AppText variant="title">{title}</AppText>
      <AppText variant="caption" color="textSecondary">
        Coming soon
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
