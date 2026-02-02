import { useNavigation } from 'expo-router';
import Head from 'expo-router/head';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/base/IconButton';
import { ThemedText } from '@/components/base/ThemedText';
import SubjectForm from '@/components/modals/SubjectForm';
import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Spacing } from '@/constants/Spacing';

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
          style={{ marginRight: Spacing.sm}}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={[CommonStyles.container, CommonStyles.content]}>
      <Head>
        <title>Matières - Dash Student</title>
      </Head>
      <ThemedText>Subjects</ThemedText>
      {isSubjectFormVisible && <SubjectForm isVisible={isSubjectFormVisible} onClose={() => setIsSubjectFormVisible(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({})