import { StyleSheet, View } from 'react-native';

import { Avatar, type AvatarData } from './Avatar';

type Props = {
  people: AvatarData[];
  size?: number;
  overlap?: number;
};

export function AvatarStack({ people, size = 28, overlap = 10 }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`Shared with ${people.map((p) => p.name).join(', ')}`}
      style={styles.row}>
      {people.map((person, index) => (
        <Avatar
          key={person.id}
          {...person}
          size={size}
          style={index < people.length - 1 ? { marginRight: -overlap } : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
