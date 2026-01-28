import { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Calendar } from '@marceloterreiro/flash-calendar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

dayjs.locale('fr');

const DATE_FORMAT = 'YYYY-MM-DD';
const FRENCH_DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface MonthCalendarProps {
  selectedDate: string;
  onDateSelect: (dateId: string) => void;
}

export function MonthCalendar({ selectedDate, onDateSelect }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().format(DATE_FORMAT));

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => dayjs(prev).subtract(1, 'month').format(DATE_FORMAT));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => dayjs(prev).add(1, 'month').format(DATE_FORMAT));
  }, []);

  const goToToday = useCallback(() => {
    const today = dayjs().format(DATE_FORMAT);
    setCurrentMonth(today);
    onDateSelect(today);
  }, [onDateSelect]);

  const monthYear = dayjs(currentMonth).format('MMMM YYYY');
  const monthYearLabel = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

  return (
    <View style={styles.container}>
      {/* Custom header with navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday}>
          <ThemedText style={styles.monthTitle}>{monthYearLabel}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Day names row */}
      <View style={styles.dayNamesRow}>
        {FRENCH_DAY_NAMES.map((day, index) => (
          <View key={index} style={styles.dayNameCell}>
            <ThemedText style={styles.dayNameText}>{day}</ThemedText>
          </View>
        ))}
      </View>

      {/* Calendar */}
      <Calendar
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarMonthId={currentMonth}
        onCalendarDayPress={onDateSelect}
        calendarColorScheme="light"
        calendarFirstDayOfWeek="monday"
        theme={{
          rowMonth: {
            container: {
              display: 'none',
            },
          },
          rowWeek: {
            container: {
              display: 'none',
            },
          },
          itemDay: {
            base: () => ({
              content: {
                fontFamily: 'Comfortaa_400Regular',
                color: Colors.black,
              },
            }),
            today: () => ({
              container: {
                borderWidth: 2,
                borderColor: Colors.secondary,
                borderRadius: 16,
              },
              content: {
                fontFamily: 'Comfortaa_700Bold',
                color: Colors.secondary,
              },
            }),
            active: () => ({
              container: {
                backgroundColor: Colors.secondary,
                borderRadius: 16,
              },
              content: {
                fontFamily: 'Comfortaa_700Bold',
                color: Colors.white,
              },
            }),
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontFamily: 'Comfortaa_700Bold',
    fontSize: 18,
    color: Colors.secondary,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayNameText: {
    fontFamily: 'Comfortaa_700Bold',
    fontSize: 14,
    color: Colors.black,
    opacity: 0.6,
  },
});
