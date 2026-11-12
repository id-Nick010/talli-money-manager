import { IconButton, ScreenHeader } from '@/components/ui';

type Props = {
  month: Date;
  hasUnreadReminders?: boolean;
  onPressMonth?: () => void;
  onPressInsights?: () => void;
  onPressCalendar?: () => void;
};

export function MonthHeader({ month, hasUnreadReminders, onPressMonth, onPressInsights, onPressCalendar }: Props) {
  const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <ScreenHeader
      title={label}
      onPressTitle={onPressMonth ?? (() => {})}
      titleAccessibilityLabel={`${label}, change month`}
      actions={
        <>
          <IconButton icon="crystalBall" accessibilityLabel="Insights" onPress={onPressInsights} />
          <IconButton
            icon="calendar"
            badge={hasUnreadReminders}
            accessibilityLabel="Bill calendar"
            onPress={onPressCalendar}
          />
        </>
      }
    />
  );
}
