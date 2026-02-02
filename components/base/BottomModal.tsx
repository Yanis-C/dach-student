import { useEffect } from 'react';
import { DimensionValue, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { FontFamily, FontSize } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { IconButton } from './IconButton';

interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: DimensionValue;
}

export function BottomModal({
  isVisible,
  onClose,
  title,
  children,
  height = '50%',
}: BottomModalProps) {
  const translateY = useSharedValue(500);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, { duration: 300 });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(500, { duration: 300 });
      overlayOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Modal animationType="none" transparent={true} visible={isVisible}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={styles.overlayPressable} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.modalContent, { height }, contentStyle]}>
          <Pressable style={{ flex: 1 }} onPress={(e) => e.stopPropagation()}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <IconButton
                icon="close"
                size={20}
                color={Colors.greyText}
                backgroundColor={Colors.greyLight}
                onPress={onClose}
              />
            </View>
            <View style={styles.content}>{children}</View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayPressable: {
    flex: 1,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  titleContainer: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  title: {
    color: Colors.black,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
});
