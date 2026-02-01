import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import { ExamData } from '@/types/exam';
import { Colors } from '@/constants/Colors';
import { Radius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

dayjs.locale('fr');

type Props = {
    examInfos: ExamData
    style?: ViewStyle
}

export default function ExamView({ examInfos, style }: Props) {
    const creationDate = dayjs(examInfos.creationDate);
    const dueDate = dayjs(examInfos.dueDate);
    const today = dayjs();

    // Calculate progress percentage
    const totalDays = dueDate.diff(creationDate, 'day');
    const elapsedDays = today.diff(creationDate, 'day');
    const progressPercentage = Math.min(Math.max(Math.round((elapsedDays / totalDays) * 100), 0), 100);

    // Days left until exam
    const daysLeft = Math.max(dueDate.diff(today, 'day'), 0);

    // Format due date
    const formattedDate = dueDate.format('D MMMM');
    
    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <View style={styles.examInfo}>
                    <Text style={styles.label}>PROCHAIN EXAMEN</Text>
                    <Text style={styles.examTitle}>{examInfos.title}</Text>
                </View>
                <View style={styles.countdown}>
                    <Text style={styles.daysLeft}>J-{daysLeft}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
            
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progression globale</Text>
                    <Text style={styles.progressValue}>{progressPercentage}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={[Colors.success, Colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.black,
        borderRadius: Radius.xl,
        padding: 20,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    examInfo: {
        gap: 4,
    },
    label: {
        fontSize: FontSize.xxs,
        fontWeight: '600',
        color: Colors.greyText,
        letterSpacing: 1,
        fontFamily: FontFamily.bold,
    },
    examTitle: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.white,
        fontFamily: FontFamily.bold,
    },
    countdown: {
        alignItems: 'flex-end',
        gap: 2,
    },
    daysLeft: {
        fontSize: FontSize.xxl,
        fontWeight: '800',
        color: Colors.warning,
        fontFamily: FontFamily.bold,
    },
    date: {
        fontSize: FontSize.sm,
        color: Colors.greyText,
        fontFamily: FontFamily.regular,
    },
    progressSection: {
        gap: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: FontSize.sm,
        color: Colors.greyText,
        fontFamily: FontFamily.regular,
    },
    progressValue: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.success,
        fontFamily: FontFamily.bold,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.greyDark,
        borderRadius: Radius.sm,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: Radius.sm,
    },
})