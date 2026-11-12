import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { colors, radii } from '@/theme';

type Props = {
  /** Uppercase label above the card; omit for a standalone card (e.g. "Sign out"). */
  title?: string;
  /** `SettingsRow`s; hairline dividers are drawn between them. */
  children: ReactNode;
};

export function SettingsGroup({ title, children }: Props) {
  const rows = Children.toArray(children);

  const card = (
    <Card radius={radii.xxl} shadow="settingsCard">
      <View style={styles.rows}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View style={styles.divider} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </Card>
  );

  if (!title) return card;

  return (
    <View style={styles.group}>
      <AppText variant="overlineBold" color="textSecondary" accessibilityRole="header">
        {title}
      </AppText>
      {card}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 7,
  },
  // Figma draws the card's stroke inside its bounds, over the rows, so the rows reach under the border.
  rows: {
    margin: -1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
