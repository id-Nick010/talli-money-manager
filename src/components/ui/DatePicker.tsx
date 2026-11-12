import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/theme';
import { addMonths, formatDateLabel, isSameDay, monthGrid, startOfDay } from '@/utils/date';

import { AppText } from './AppText';
import { BrandGradient } from './BrandGradient';
import { Icon, type IconName } from './Icon';
import { Popover } from './Popover';

/** Figma keeps the 1pt stroke out of the padding; React Native pads inside the border. */
const STROKE = 1;
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_SIZE = 32;
/** Wide enough for a comfortable 7-column grid even when the field itself is narrow. */
const CALENDAR_MIN_WIDTH = 300;

type DatePickerFieldProps = {
  /** Used for the screen-reader label, e.g. "Due date". */
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  /** Earliest pickable day (inclusive). */
  minDate?: Date;
  /** Latest pickable day (inclusive). */
  maxDate?: Date;
  icon?: IconName;
  /** How the picked date reads in the field; defaults to "Today" / "Sep 12" style labels. */
  formatValue?: (date: Date) => string;
  style?: StyleProp<ViewStyle>;
};

/** A date field that opens a floating month calendar; picking a day closes it. */
export function DatePickerField({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  icon = 'calendarSm',
  formatValue = formatDateLabel,
  style,
}: DatePickerFieldProps) {
  const anchor = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const text = formatValue(value);

  return (
    <>
      <Pressable
        ref={anchor}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${text}`}
        accessibilityHint="Opens a calendar to pick a date"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.field, open && styles.fieldOpen, pressed && styles.pressed, style]}>
        <Icon name={icon} />
        <AppText variant="inputMedium" numberOfLines={1} style={styles.fieldText}>
          {text}
        </AppText>
      </Pressable>

      <Popover anchor={anchor} visible={open} onClose={() => setOpen(false)} minWidth={CALENDAR_MIN_WIDTH}>
        <CalendarPanel
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </Popover>
    </>
  );
}

type CalendarPanelProps = {
  value: Date;
  onChange: (date: Date) => void;
  /** Earliest pickable day (inclusive). */
  minDate?: Date;
  /** Latest pickable day (inclusive). */
  maxDate?: Date;
};

/** Month calendar grid. Days outside `minDate`–`maxDate` are disabled. */
function CalendarPanel({ value, onChange, minDate, maxDate }: CalendarPanelProps) {
  const [month, setMonth] = useState(() => addMonths(value, 0));
  const today = new Date();
  const min = minDate && startOfDay(minDate);
  const max = maxDate && startOfDay(maxDate);

  const isDisabled = (day: Date) => (min ? day < min : false) || (max ? day > max : false);
  const canGoBack = !min || addMonths(month, 0) > min;
  const canGoForward = !max || addMonths(month, 1) <= max;
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <MonthButton direction="previous" disabled={!canGoBack} onPress={() => setMonth(addMonths(month, -1))} />
        <AppText variant="rowTitle" accessibilityRole="header" style={styles.monthLabel}>
          {monthLabel}
        </AppText>
        <MonthButton direction="next" disabled={!canGoForward} onPress={() => setMonth(addMonths(month, 1))} />
      </View>

      <View style={styles.week}>
        {WEEKDAYS.map((weekday, index) => (
          <AppText key={index} variant="microMedium" color="textMuted" style={styles.weekday}>
            {weekday}
          </AppText>
        ))}
      </View>

      {monthGrid(month).map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((day, dayIndex) => {
            if (!day) return <View key={dayIndex} style={styles.cell} />;
            const selected = isSameDay(day, value);
            const isToday = isSameDay(day, today);
            const disabled = isDisabled(day);
            return (
              <View key={dayIndex} style={styles.cell}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  hitSlop={2}
                  onPress={() => onChange(day)}
                  style={({ pressed }) => [
                    styles.day,
                    isToday && !selected && styles.today,
                    pressed && styles.pressed,
                  ]}>
                  {selected ? (
                    <View style={styles.selectedFill}>
                      <BrandGradient />
                    </View>
                  ) : null}
                  <AppText
                    variant={selected || isToday ? 'labelSemiboldMd' : 'inputMedium'}
                    color={selected ? 'white' : disabled ? 'textMuted' : isToday ? 'brand' : 'textPrimary'}
                    style={[styles.dayText, disabled && styles.dayDisabled]}>
                    {day.getDate()}
                  </AppText>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function MonthButton({
  direction,
  disabled,
  onPress,
}: {
  direction: 'previous' | 'next';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'previous' ? 'Previous month' : 'Next month'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.monthButton, disabled && styles.monthButtonDisabled, pressed && styles.pressed]}>
      <Icon name="chevronLeft" style={direction === 'next' && styles.flipped} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10 - STROKE,
    borderRadius: 10,
    borderWidth: STROKE,
    borderColor: colors.border,
  },
  fieldOpen: {
    borderColor: colors.brand,
  },
  fieldText: {
    flexShrink: 1,
    height: 18,
    lineHeight: 18,
  },
  panel: {
    gap: 4,
    padding: 12 - STROKE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  monthLabel: {
    lineHeight: 17,
  },
  monthButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.track,
  },
  monthButtonDisabled: {
    opacity: 0.35,
  },
  flipped: {
    transform: [{ rotate: '180deg' }],
  },
  week: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    lineHeight: 20,
  },
  cell: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DAY_SIZE / 2,
  },
  today: {
    backgroundColor: colors.brandWash,
  },
  selectedFill: {
    ...StyleSheet.absoluteFill,
    borderRadius: DAY_SIZE / 2,
    overflow: 'hidden',
  },
  dayText: {
    lineHeight: 18,
  },
  dayDisabled: {
    opacity: 0.5,
  },
});
