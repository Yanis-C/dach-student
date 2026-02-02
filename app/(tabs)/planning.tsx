import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useNavigation } from 'expo-router';
import Head from 'expo-router/head';
import { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Radius, Spacing } from '@/constants/Spacing';

import { SwitchButton } from '@/components/base/SwitchButton';
import { ThemedText } from '@/components/base/ThemedText';
import { MarkedDates, MonthCalendar } from '@/components/MonthCalendar';
import { WeekCalendar } from '@/components/WeekCalendar';

import { IconButton } from '@/components/base/IconButton';
import eventsData from '@/example/json/events.json';
import { Event, EventsData } from '@/types/event';

dayjs.locale('fr');

const DATE_FORMAT = 'YYYY-MM-DD';
const today = dayjs().format(DATE_FORMAT);

//from exampleEvents import
const exampleEvents: EventsData = eventsData;

// Transform the imported events into MarkedDates format
const transformEventsToMarkedDates = (events: EventsData): MarkedDates => {
  const markedDates: MarkedDates = {};

  Object.entries(events).forEach(([date, eventList]) => {
    markedDates[date] = {
      dots: eventList.map(event => ({
        key: event.key,
        color: event.color,
      })),
    };
  });

  return markedDates;
};

const exampleMarkedDates: MarkedDates = transformEventsToMarkedDates(exampleEvents);

export default function PlanningScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedCalendar, setSelectedCalendar] = useState<'week' | 'month'>('month');

  const selectedDayEvents: Event[] = exampleEvents[selectedDate] || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="add"
          onPress={() => console.log('Add subject')}
          size={20}
          color={Colors.white}
          backgroundColor={Colors.secondary}
          style={{ marginRight: Spacing.sm, borderRadius: Radius.md }}
        />
      ),
    });
  }, [navigation, selectedCalendar]);

  const handleDateSelect = useCallback((dateId: string) => {
    setSelectedDate(dateId);
  }, []);

  return (
    <ScrollView style={CommonStyles.container} contentContainerStyle={CommonStyles.content}>
      <Head>
        <title>Planning - Dash Student</title>
      </Head>

      <SwitchButton
        options={['week', 'month']}
        labels={['Semaine', 'Mois']}
        value={selectedCalendar}
        onChange={setSelectedCalendar}
      />

      {selectedCalendar === 'week' && (
        <WeekCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          markedDates={exampleMarkedDates}
        />
      )}

      {selectedCalendar === 'month' && (
        <MonthCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          markedDates={exampleMarkedDates}
        />
      )}

      <View style={styles.selectedDateContainer}>
        <ThemedText style={CommonStyles.subheading}>
          {formatDate(selectedDate)}
        </ThemedText>
        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event) => (
            <ThemedText key={event.key}>{event.title}</ThemedText>
          ))
        ) : (
          <ThemedText variant="caption" color={Colors.greyText}>
            Aucun événement prévu ce jour
          </ThemedText>
        )}
      </View>
    </ScrollView>
  );
}

function formatDate(dateId: string): string {
  const formatted = dayjs(dateId).format('dddd D MMMM YYYY');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const styles = StyleSheet.create({
  selectedDateContainer: {
    flex: 1,
  },
});