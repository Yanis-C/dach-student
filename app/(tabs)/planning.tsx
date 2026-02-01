import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useNavigation } from 'expo-router';
import Head from 'expo-router/head';
import { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Spacing } from '@/constants/Spacing';

import { SwitchButton } from '@/components/base/SwitchButton';
import { ThemedText } from '@/components/base/ThemedText';
import { MonthCalendar } from '@/components/MonthCalendar';

dayjs.locale('fr');

const DATE_FORMAT = 'YYYY-MM-DD';
const today = dayjs().format(DATE_FORMAT);

export default function PlanningScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedCalendar, setSelectedCalendar] = useState<'week' | 'month'>('month');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <ThemedText style={{ marginRight: Spacing.lg }}>
            {dayjs().format('D MMMM YYYY')}
          </ThemedText>
        </View>
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

      {selectedCalendar === 'month' && (
        <MonthCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />)
      }

      <View style={styles.selectedDateContainer}>
        <ThemedText style={CommonStyles.subheading}>
          {formatDate(selectedDate)}
        </ThemedText>
        <ThemedText variant="caption" color={Colors.greyText}>
          Aucun événement prévu ce jour
        </ThemedText>
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