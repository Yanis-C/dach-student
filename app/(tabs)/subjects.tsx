import { useNavigation } from 'expo-router';
import Head from 'expo-router/head';
import { useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/base/IconButton';
import { MainSubject } from '@/components/MainSubject';
import SubjectForm from '@/components/modals/SubjectForm';
import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Spacing } from '@/constants/Spacing';
import { Subject } from '@/types/Subject';

const MOCK_SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Mathématiques',
    color: '#5856D6',
    icon: 'calculator',
    chapters: 6,
    completedChapters: 4,
  },
  {
    id: '2',
    name: 'Physique-Chimie',
    color: '#E67E22',
    icon: 'flask',
    chapters: 8,
    completedChapters: 3,
  },
];

export default function SubjectsScreen() {
  const navigation = useNavigation();
  const [isSubjectFormVisible, setIsSubjectFormVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="add"
          onPress={() => setIsSubjectFormVisible(true)}
          size={20}
          color={Colors.white}
          backgroundColor={Colors.secondary}
          style={{ marginRight: Spacing.sm }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={[CommonStyles.container, CommonStyles.content]}>
      <Head>
        <title>Matières - Dash Student</title>
      </Head>
      <FlatList
        data={MOCK_SUBJECTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MainSubject subject={item} onPress={() => console.log('pressed', item.name)} />
        )}
      />
      {isSubjectFormVisible && (
        <SubjectForm
          isVisible={isSubjectFormVisible}
          onClose={() => setIsSubjectFormVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
});