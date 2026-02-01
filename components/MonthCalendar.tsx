import dayjs from 'dayjs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';
import { ThemedText } from './base/ThemedText';

const TODAY = dayjs().format('YYYY-MM-DD');

// Configure French locale
LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ],
  monthNamesShort: [
    'Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

export interface DotMarking {
  key: string;
  color: string;
  selectedDotColor?: string;
}

export interface MarkedDateData {
  dots?: DotMarking[];
  disabled?: boolean;
}

export type MarkedDates = Record<string, MarkedDateData>;

interface MonthCalendarProps {
  selectedDate: string;
  onDateSelect: (dateId: string) => void;
  markedDates?: MarkedDates;
}

const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'}; 

export function MonthCalendar({ selectedDate, onDateSelect, markedDates = {} }: MonthCalendarProps) {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => onDateSelect(day.dateString)}
        firstDay={1}
        hideExtraDays={false}
        markingType={'multi-dot'}
        markedDates={{
          '2026-01-25':
            { dots: [vacation, massage, workout] },
          '2026-01-26':
            { dots: [massage, workout], disabled: true }
        }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          arrowColor: Colors.secondary,
          monthTextColor: Colors.secondary,
          textMonthFontFamily: FontFamily.bold,
          textDayHeaderFontFamily: FontFamily.bold,
          textMonthFontSize: FontSize.lg,
          textDayHeaderFontSize: FontSize.sm,
        }}
        dayComponent={({ date, state, marking }) => {
          const isToday = date?.dateString === TODAY;
          const isSelected = date?.dateString === selectedDate;
          const isDisabled = state === 'disabled';
          const dots = (marking as MarkedDateData)?.dots || [];

          return (
            <TouchableOpacity
              onPress={() => date && onDateSelect(date.dateString)}
              style={[
                styles.dayContainer,
                isDisabled && styles.dayContainerDisabled,
              ]}
              activeOpacity={0.7}
              disabled={isDisabled}
            >
              <View
                style={[
                  styles.dayBase,
                  isToday && !isSelected && styles.dayToday,
                  isSelected && styles.daySelected,
                ]}
              >
                <ThemedText
                  style={[
                    styles.dayText,
                    isDisabled && styles.dayTextDisabled,
                    isToday && !isSelected && styles.dayTextToday,
                    isSelected && styles.dayTextSelected,
                  ]}
                >
                  {date?.day}
                </ThemedText>
              </View>
              
              {dots.length > 0 && (
                <View style={styles.dotsContainer}>
                  {dots.slice(0, 3).map((dot) => (
                    <View
                      key={dot.key}
                      style={[
                        styles.dot,
                        { backgroundColor: isSelected && dot.selectedDotColor ? dot.selectedDotColor : dot.color },
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainerDisabled: {
    opacity: 0.3,
  },
  dayBase: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    borderColor: Colors.secondary,
  },
  daySelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  dayText: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'ios' ? FontSize.md : FontSize.sm,
    color: Colors.black,
  },
  dayTextDisabled: {
    opacity: 0.3,
  },
  dayTextToday: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
  dayTextSelected: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },
});
