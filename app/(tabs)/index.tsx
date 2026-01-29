import { StyleSheet, Text, View } from "react-native";
import Head from "expo-router/head";

import { ExamData } from "@/types/exam";
import { CommonStyles } from "@/constants/CommonStyles";

import { Card } from "@/components/base/Card";
import { ThemedText } from "@/components/base/ThemedText";
import ExamView from "@/components/ExamView";


const nextExam: ExamData = {
  title: "Bac 2026",
  dueDate: "2026-06-15",
  creationDate: "2025-12-15",
}

export default function DashboardScreen() {
  return (
    <View
      style={[CommonStyles.container]}
    >
      <Head>
        <title>Dashboard - Dash Student</title>
      </Head>
      {nextExam && (
        <ExamView style={{ marginVertical: 8 }} examInfos={nextExam} />
      )}
      <Card>
        <Text style={CommonStyles.heading}>Dashboard Card</Text>
        <Text style={CommonStyles.text}>This is a card component styled with CommonStyles.</Text>
      </Card>
      <Text style={CommonStyles.text}>Hello Yanis !</Text>
      <ThemedText>Welcome to Dashboard !</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  }
});