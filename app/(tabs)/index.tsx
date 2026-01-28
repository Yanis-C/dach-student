import Card from "@/components/Card";
import ExamView from "@/components/ExamView";
import { ThemedText } from "@/components/ThemedText";
import { CommonStyles } from "@/constants/CommonStyles";
import { ExamData } from "@/types/exam";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


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
      { nextExam && (
        <ExamView style={{marginVertical: 8}} examInfos={nextExam} />
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