import { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import { CommonStyles } from '@/constants/CommonStyles';
import { ThemedText } from '@/components/ThemedText';
import { MonthCalendar } from '@/components/MonthCalendar';

dayjs.locale('fr');

const DATE_FORMAT = 'YYYY-MM-DD';
const today = dayjs().format(DATE_FORMAT);

export default function PlanningScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateSelect = useCallback((dateId: string) => {
    setSelectedDate(dateId);
  }, []);

  return (
    <View style={[CommonStyles.container, { paddingTop: insets.top + 16 }]}>
      <View>
        <ThemedText style={CommonStyles.heading}>Planning</ThemedText>
      </View>

      <MonthCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      <View style={styles.selectedDateContainer}>
        <ThemedText style={CommonStyles.subheading}>
          {formatDate(selectedDate)}
        </ThemedText>
        <ThemedText style={styles.noEventsText}>
          Aucun événement prévu ce jour
        </ThemedText>
      </View>
    </View>
  );
}

function formatDate(dateId: string): string {
  const formatted = dayjs(dateId).format('dddd D MMMM YYYY');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const styles = StyleSheet.create({
  selectedDateContainer: {
    flex: 1,
    marginTop: 24,
  },
  noEventsText: {
    color: '#888',
    fontFamily: 'Comfortaa_400Regular',
    fontSize: 14,
  },
});