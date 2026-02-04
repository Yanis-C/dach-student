import Head from "expo-router/head";
import { ScrollView, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { CommonStyles } from "@/constants/CommonStyles";
import { Spacing } from "@/constants/Spacing";
import { ExamData } from "@/types/exam";

import { Card } from "@/components/base/Card";
import { IconBadge } from "@/components/base/IconBadge";
import ImageIcon from "@/components/base/ImageIcon";
import { ProgressBar } from "@/components/base/ProgressBar";
import { SmallCard } from "@/components/base/SmallCard";
import { Tag } from "@/components/base/Tag";
import { ThemedText } from "@/components/base/ThemedText";
import ExamView from "@/components/ExamView";

const nextExam: ExamData = {
  title: "Bac 2026",
  dueDate: "2026-06-15",
  creationDate: "2025-12-15",
};

const teckelImage = require("@/assets/images/teckel-chill.png");

export default function DashboardScreen() {
  return (
    <ScrollView
      style={CommonStyles.container}
      contentContainerStyle={CommonStyles.content}
    >
      <Head>
        <title>Dashboard - Dash Student</title>
      </Head>


      <ImageIcon
        source={teckelImage}
        width={120}
        height={120}
        style={{ alignSelf: "center", marginTop: Spacing.lg }}
      />

      {nextExam && (
        <ExamView style={{ marginVertical: Spacing.sm }} examInfos={nextExam} />
      )}

      {/* Upcoming Exams Section */}
      <View style={styles.cardList}>
        <SmallCard
          icon={
            <IconBadge
              icon="calculator"
              backgroundColor="#FEF3C7"
              color="#D97706"
            />
          }
          rightElement={<Tag text="J-21" />}
        >
          <ThemedText bold>Maths - Bac blanc</ThemedText>
          <ThemedText variant="caption" color={Colors.primary}>
            12 février - Coef. 7
          </ThemedText>
        </SmallCard>

        <SmallCard
          icon={
            <IconBadge
              icon="flask"
              backgroundColor={Colors.greyLight}
              color={Colors.greyText}
            />
          }
          rightElement={<Tag text="J-6" />}
        >
          <ThemedText bold>Physique - Controle</ThemedText>
          <ThemedText variant="caption" color={Colors.greyText}>
            28 janvier - Coef. 5
          </ThemedText>
        </SmallCard>
      </View>

      {/* Study Progress Section */}
      <Card title="Progression" style={styles.section}>
        <View style={styles.cardList}>
          <SmallCard
            icon={
              <IconBadge
                icon="language"
                backgroundColor="#DBEAFE"
                color="#2563EB"
              />
            }
            rightElement={
              <ThemedText variant="caption" color={Colors.greyText}>
                50%
              </ThemedText>
            }
          >
            <ThemedText bold>Anglais</ThemedText>
            <ProgressBar progress={0.5} color="#FBBF24" />
          </SmallCard>

          <SmallCard
            icon={
              <IconBadge
                icon="book"
                backgroundColor="#FEE2E2"
                color="#DC2626"
              />
            }
            rightElement={
              <ThemedText variant="caption" color={Colors.greyText}>
                40%
              </ThemedText>
            }
          >
            <ThemedText bold>Histoire-Geo</ThemedText>
            <ProgressBar progress={0.4} color="#22C55E" />
          </SmallCard>
        </View>
      </Card>

      {/* Tasks Section */}
      <Card title="A faire" style={styles.section}>
        <View style={styles.cardList}>
          <SmallCard
            icon={
              <View style={styles.circleIcon} />
            }
          >
            <ThemedText bold>Anglais - Vocabulaire</ThemedText>
            <ThemedText variant="caption" color={Colors.greyText}>
              Flashcards - A faire
            </ThemedText>
          </SmallCard>

          <SmallCard
            icon={
              <View style={[styles.circleIcon, styles.circleIconChecked]} />
            }
          >
            <ThemedText bold color={Colors.greyText} style={styles.strikethrough}>
              Maths - Exercices
            </ThemedText>
            <ThemedText variant="caption" color={Colors.greyText}>
              Chapitre 5 - Terminé
            </ThemedText>
          </SmallCard>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.md,
  },
  cardList: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  circleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.white,
  },
  circleIconChecked: {
    backgroundColor: Colors.greyLight,
    borderColor: Colors.greyLight,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
});
