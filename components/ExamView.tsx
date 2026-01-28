import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ExamData } from '@/types/exam'
import { CommonStyles } from '@/constants/CommonStyles'
import { Colors } from '@/constants/Colors'

type Props = {
    examInfos: ExamData
    style?: ViewStyle
}

export default function ExamView({ examInfos, style }: Props) {
    // Calculate progress percentage based on dates
    const creationDate = new Date(examInfos.creationDate);
    const dueDate = new Date(examInfos.dueDate);
    const currentDate = new Date();
    
    const totalTime = dueDate.getTime() - creationDate.getTime();
    const elapsedTime = currentDate.getTime() - creationDate.getTime();
    const progressPercentage = Math.min(Math.max(Math.round((elapsedTime / totalTime) * 100), 0), 100);
    
    // Calculate days left until exam
    const timeLeft = dueDate.getTime() - currentDate.getTime();
    const daysLeft = Math.max(Math.ceil(timeLeft / (1000 * 60 * 60 * 24)), 0);
    
    // Format due date
    const formattedDate = dueDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    
    return (
        <View style={[styles.container, style]}>
            {/* Header with exam info and countdown */}
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
            
            {/* Progress section */}
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progression globale</Text>
                    <Text style={styles.progressValue}>{progressPercentage}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={['#22C55E', '#6366F1']}
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
        borderRadius: 20,
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
        fontSize: 10,
        fontWeight: '600',
        color: '#9CA3AF',
        letterSpacing: 1,
        fontFamily: 'Comfortaa_700Bold',
    },
    examTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.white,
        fontFamily: 'Comfortaa_700Bold',
    },
    countdown: {
        alignItems: 'flex-end',
        gap: 2,
    },
    daysLeft: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FCD34D',
        fontFamily: 'Comfortaa_700Bold',
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Comfortaa_400Regular',
    },
    progressSection: {
        gap: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Comfortaa_400Regular',
    },
    progressValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#22C55E',
        fontFamily: 'Comfortaa_700Bold',
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: '#333333',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
})