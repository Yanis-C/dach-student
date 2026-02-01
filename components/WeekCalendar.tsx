import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ThemedText } from './base/ThemedText';
import { MarkedDateData, MarkedDates } from './MonthCalendar';

dayjs.locale('fr');

const TODAY = dayjs().format('YYYY-MM-DD');
const DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D']; // Mon-Sun in French

interface WeekCalendarProps {
  selectedDate: string;
  onDateSelect: (dateId: string) => void;
  markedDates?: MarkedDates;
}

/**
 * Returns array of 7 days for the week containing the given date (Monday-Sunday)
 * Returns: [dayjs('2026-02-02'), dayjs('2026-02-03'), ..., dayjs('2026-02-08')]
 */
function getWeekDays(date: dayjs.Dayjs): dayjs.Dayjs[] {
  const startOfWeek = date.startOf('week');
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
}


// Ex: '2026-12-01' => "Décembre 2026"
function formatMonthYear(date: dayjs.Dayjs): string {
  const month = date.format('MMMM');
  const year = date.format('YYYY');
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

export function WeekCalendar({ selectedDate, onDateSelect, markedDates = {} }: WeekCalendarProps) {
  const [currentWeekDate, setCurrentWeekDate] = useState(dayjs(selectedDate));

  const weekDays = getWeekDays(currentWeekDate);

  const goToPreviousWeek = () => {
    setCurrentWeekDate(prev => prev.subtract(7, 'day'));
  };

  const goToNextWeek = () => {
    setCurrentWeekDate(prev => prev.add(7, 'day'));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekDate(dayjs());
  }

  const { panGesture, animatedStyle } = useSwipeNavigation({
    onSwipeLeft: goToNextWeek,
    onSwipeRight: goToPreviousWeek,
    threshold: 30,
  })

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
            {/* Header: displays "Month Year" title and navigation arrows */}
            <View style={styles.header}>
              <Pressable onPress={goToCurrentWeek}>
                <ThemedText style={styles.headerTitle}>
                  {formatMonthYear(currentWeekDate)}
                </ThemedText>
              </Pressable>
              <View style={styles.headerArrows}>
                <Pressable onPress={goToPreviousWeek} hitSlop={8}>
                  {({ pressed }) => (
                    <Ionicons name="chevron-back" size={20} color={Colors.secondary} style={{ opacity: pressed ? 0.7 : 1 }} />
                  )}
                </Pressable>
                <Pressable onPress={goToNextWeek} hitSlop={8}>
                  {({ pressed }) => (
                    <Ionicons name="chevron-forward" size={20} color={Colors.secondary} style={{ opacity: pressed ? 0.7 : 1 }} />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Day name labels row: L M M J V S D (French Mon-Sun) */}
            <View style={styles.row}>
              {DAY_NAMES.map((name, index) => (
                <View key={index} style={styles.cell}>
                  <ThemedText style={styles.dayName}>{name}</ThemedText>
                </View>
              ))}
            </View>

            {/* Day circles row */}
            <View style={styles.row}>
              {weekDays.map((day) => {
                const dateString = day.format('YYYY-MM-DD');
                const isToday = dateString === TODAY;
                const isSelected = dateString === selectedDate;
                const isPast = day.isBefore(dayjs(), 'day');
                const isCurrentWeek = dayjs().startOf('week').isSame(currentWeekDate.startOf('week'), 'day');
                const isPastCurrentWeek = isPast && isCurrentWeek; // Past day in current week (green + checkmark)
                const isPastOtherWeek = isPast && !isCurrentWeek; // Past day in other weeks (grey + opacity)
                const marking = markedDates[dateString];
                const isDisabled = marking?.disabled;
                const dots = (marking as MarkedDateData)?.dots || [];

                return (
                  <View key={dateString} style={styles.cell}>
                    <Pressable
                      onPress={() => onDateSelect(dateString)}
                      disabled={isDisabled}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                      {/* Circle: today=purple border, green=past in current week, purple filled=selected, grey=future/past other weeks */}
                      <View
                        style={[
                          styles.dayCircle,
                          isToday && !isSelected && styles.dayCircleToday,
                          isPastCurrentWeek && !isSelected && !isToday && styles.dayCirclePast,
                          isPastOtherWeek && !isSelected && styles.dayCirclePastOther,
                          !isPast && !isSelected && !isToday && styles.dayCircleFuture,
                          isSelected && styles.dayCircleSelected,
                        ]}
                      >
                        {/* Content: checkmark for past days in current week (not today), day number otherwise */}
                        {isPastCurrentWeek && !isSelected && !isToday ? (
                          <Ionicons name="checkmark" size={18} color={Colors.white} />
                        ) : (
                          <ThemedText
                            style={[
                              styles.dayNumber,
                              isToday && !isSelected && styles.dayNumberToday,
                              isSelected && styles.dayNumberSelected,
                              !isPast && !isSelected && !isToday && styles.dayNumberFuture,
                              isPastOtherWeek && !isSelected && styles.dayNumberPastOther,
                            ]}
                          >
                            {day.date()}
                          </ThemedText>
                        )}
                      </View>

                      {/* Dot markers: up to 3 colored dots below day circle (events/tasks) */}
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
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.secondary,
    paddingLeft: Spacing.lg,
  },
  headerArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    color: Colors.secondary,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.greyText,
    marginBottom: Spacing.sm,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    borderColor: Colors.secondary,
    backgroundColor: 'transparent',
  },
  dayCirclePast: {
    backgroundColor: Colors.success,
  },
  dayCirclePastOther: {
    backgroundColor: Colors.greyLight,
    opacity: 0.8,
  },
  dayCircleFuture: {
    backgroundColor: Colors.greyLight,
  },
  dayCircleSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  dayNumber: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  dayNumberToday: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
  dayNumberSelected: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  dayNumberFuture: {
    color: Colors.greyText,
  },
  dayNumberPastOther: {
    color: Colors.greyText,
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
