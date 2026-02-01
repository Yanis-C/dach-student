import dayjs from 'dayjs';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { Colors } from '@/constants/Colors';
import { Radius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const TODAY = dayjs().format('YYYY-MM-DD');

//Not used currently, but kept for future reference

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

interface MonthCalendarNewProps {
  selectedDate: string;
  onDateSelect: (dateId: string) => void;
}

const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' };
const workout = { key: 'workout', color: 'green' };

const baseMarkedDates = {
  '2026-01-25':
    { dots: [vacation, massage, workout] },
  '2026-01-26':
    { dots: [massage, workout], disabled: true }
}

export function MonthCalendarOld({ selectedDate, onDateSelect }: MonthCalendarNewProps) {
  const markedDates = useMemo(() => {
    const marks: Record<string, object> = {
      ...baseMarkedDates,

      [TODAY]: {
        customStyles: {
          container: {
            //TODO: apply border without increasing size of the day component
            borderWidth: 2,
            borderColor: Colors.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          },
          text: {
            color: Colors.secondary,
            fontFamily: FontFamily.bold,
          },
        },
      },
    };

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        customStyles: {
          container: {
            backgroundColor: Colors.secondary,
            borderColor: Colors.secondary,
          },
          text: {
            color: Colors.white,
            fontFamily: FontFamily.bold,
          },
        },
      };
    }

    return marks;
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => onDateSelect(day.dateString)}
        firstDay={1}
        hideExtraDays={false}
        markingType={'multi-dot'}
        markedDates={markedDates}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          selectedDayBackgroundColor: Colors.secondary,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.secondary,
          dayTextColor: Colors.black,
          textDisabledColor: `${Colors.black}4D`,
          arrowColor: Colors.secondary,
          monthTextColor: Colors.secondary,
          textDayFontFamily: FontFamily.regular,
          textMonthFontFamily: FontFamily.bold,
          textDayHeaderFontFamily: FontFamily.bold,
          textDayFontSize: FontSize.sm,
          textMonthFontSize: FontSize.lg,
          textDayHeaderFontSize: FontSize.sm,
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
});
