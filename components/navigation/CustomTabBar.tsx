import { View, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Spacing, Radius } from '@/constants/Spacing';

const ICON_SIZE = 22;
const ACTIVE_CIRCLE_SIZE = 40;

type IoniconName = keyof typeof Ionicons.glyphMap;
interface TabIconMapping {
  [key: string]: {
    outline: IoniconName;
    filled: IoniconName;
  };
}

const TAB_ICONS: TabIconMapping = {
  index: { outline: 'home-outline', filled: 'home-sharp' },
  planning: { outline: 'calendar-outline', filled: 'calendar' },
  subjects: { outline: 'book-outline', filled: 'book' },
  coach: { outline: 'sparkles-outline', filled: 'sparkles' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Dachboard',
  planning: 'Planning',
  subjects: 'Exams',
  coach: 'Coach',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, { marginBottom: Spacing.xl + insets.bottom }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const routeName = route.name as keyof TabIconMapping;
          const icons = TAB_ICONS[routeName];
          const label = TAB_LABELS[routeName] || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              {focused ? (
                <View style={styles.activeBackground}>
                  <Ionicons
                    name={icons.filled}
                    size={ICON_SIZE}
                    color={Colors.white}
                  />
                </View>
              ) : (
                <Ionicons
                  name={icons.outline}
                  size={ICON_SIZE}
                  color={Colors.greyText}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 28,
    width: '70%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ACTIVE_CIRCLE_SIZE,
  },
  activeBackground: {
    width: ACTIVE_CIRCLE_SIZE,
    height: ACTIVE_CIRCLE_SIZE,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
