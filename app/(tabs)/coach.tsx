import { StyleSheet, View } from 'react-native';
import Head from 'expo-router/head';

import { CommonStyles } from '@/constants/CommonStyles';
import { ThemedText } from '@/components/base/ThemedText';

export default function CoachScreen() {
  return (
    <View style={[CommonStyles.container, CommonStyles.content]}>
      <Head>
        <title>Coach - Dash Student</title>
      </Head>
      <ThemedText>Coach</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({})