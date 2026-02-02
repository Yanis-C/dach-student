import Head from "expo-router/head";
import { Text, View } from "react-native";

import { CommonStyles } from "@/constants/CommonStyles";
import { ExamData } from "@/types/exam";

import { Card } from "@/components/base/Card";
import ImageIcon from "@/components/base/ImageIcon";
import { ThemedText } from "@/components/base/ThemedText";
import ExamView from "@/components/ExamView";


const nextExam: ExamData = {
  title: "Bac 2026",
  dueDate: "2026-06-15",
  creationDate: "2025-12-15",
}

const teckelImage = require('@/assets/images/teckel-chill.png');

export default function DashboardScreen() {
  return (
    <View style={[CommonStyles.container, CommonStyles.content]}>
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
      <ThemedText>Welcome to Dashboar</ThemedText>
      <ImageIcon source={teckelImage} width={120} height={120} style={{alignSelf: 'center'}} />
    </View>
  );
}