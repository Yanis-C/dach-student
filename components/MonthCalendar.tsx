import dayjs from 'dayjs';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { ThemedText } from './base/ThemedText';

const TODAY = dayjs().format('YYYY-MM-DD');

// French locale configuration for month/day names
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

/** Single dot marker for a date (used for events/tasks) */
export interface DotMarking {
  key: string;
  color: string;
  selectedDotColor?: string; // Color when day is selected
}

/** Data for a marked date (dots + disabled state) */
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

const SWIPE_THRESHOLD = 50;

export function MonthCalendar({ selectedDate, onDateSelect, markedDates = {} }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const { width } = useWindowDimensions();

  // Animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleDayPress = (date: DateData) => {
    const selectedMonth = dayjs(date.dateString).format('YYYY-MM');
    const displayedMonth = dayjs(currentMonth).format('YYYY-MM');

    // If clicking on a day from a different month, navigate to that month
    if (selectedMonth !== displayedMonth) {
      setCurrentMonth(date.dateString);
    }

    onDateSelect(date.dateString);
  };

  // Navigate to previous month with animation
  const goToPreviousMonth = () => {
    const newMonth = dayjs(currentMonth).subtract(1, 'month').format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
  };

  // Navigate to next month with animation
  const goToNextMonth = () => {
    const newMonth = dayjs(currentMonth).add(1, 'month').format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
  };

  // Swipe gesture handler
  const { panGesture, animatedStyle } = useSwipeNavigation({
    onSwipeLeft: goToNextMonth,
    onSwipeRight: goToPreviousMonth,
    threshold: SWIPE_THRESHOLD,
  })


  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
            <Calendar
            key={currentMonth}
            current={currentMonth}
            onDayPress={handleDayPress}
            onMonthChange={(month) => setCurrentMonth(month.dateString)}
            firstDay={1} // Week starts on Monday
            hideExtraDays={false} // Show days from adjacent months
            markingType={'multi-dot'} // Allows multiple colored dots per day
            markedDates={markedDates}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              arrowColor: Colors.secondary,
              monthTextColor: Colors.secondary,
              textMonthFontFamily: FontFamily.bold,
              textDayHeaderFontFamily: FontFamily.bold,
              textMonthFontSize: FontSize.lg,
              textDayHeaderFontSize: FontSize.sm,
              textSectionTitleColor: Colors.greyText,
            }}
            // Custom day rendering with selection states and dot markers
            dayComponent={({ date, state, marking }) => {
              const isToday = date?.dateString === TODAY;
              const isSelected = date?.dateString === selectedDate;
              const isOtherMonth = state === 'disabled' && date?.month !== dayjs(currentMonth).month() + 1;
              const isDisabled = marking?.disabled;
              const dots = (marking as MarkedDateData)?.dots || [];

              return (
                <Pressable
                  onPress={() => date && handleDayPress(date as DateData)}
                  style={({ pressed }) => [
                    styles.dayContainer,
                    isOtherMonth && styles.dayContainerOtherMonth, // Faded for adjacent months
                    isDisabled && styles.dayContainerDisabled, // Dimmed when disabled
                    pressed && { opacity: 0.7 },
                  ]}
                  disabled={isDisabled}
                >
                  {/* Day circle */}
                  <View
                    style={[
                      styles.dayBase,
                      isToday && !isSelected && styles.dayToday,
                      isSelected && styles.daySelected,
                    ]}
                  >
                    {/* Day number text */}
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

                  {/* Dot markers: up to 3 colored dots below day number (events/tasks) */}
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
                </Pressable>
              );
            }}
          />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainerOtherMonth: {
    opacity: 0.4,
  },
  dayContainerDisabled: {
    opacity: 0.3,
  },
  dayBase: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: Colors.greyLight,
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
