import { StyleSheet, View } from 'react-native';
import Head from 'expo-router/head';

import { CommonStyles } from '@/constants/CommonStyles';
import { ThemedText } from '@/components/base/ThemedText';

export default function SubjectsScreen() {
  return (
    <View style={[CommonStyles.container, CommonStyles.content]}>
      <Head>
        <title>Matières - Dash Student</title>
      </Head>
      <ThemedText>Subjects</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({})