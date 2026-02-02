import { Colors } from "@/constants/Colors";
import { CommonStyles } from "@/constants/CommonStyles";
import { Spacing } from "@/constants/Spacing";
import { FontFamily, FontSize } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const iconSize = 24;

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: Colors.white },
                headerShadowVisible: false,
                headerTintColor: Colors.black,
                headerTitleStyle: {
                    fontFamily: FontFamily.bold,
                    fontSize: FontSize.lg,
                },
                headerTitleAlign: 'left',
                headerLeftContainerStyle: { paddingLeft: Spacing.lg },
                headerRightContainerStyle: { paddingRight: Spacing.lg },
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.sm,
                    height: 60 + insets.bottom,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarLabelStyle: {
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.xs,
                },
                tabBarLabelPosition: 'below-icon',
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "Dachboard",
                headerRight: () => <Text style={CommonStyles.text}>Hello Yanis !</Text>,
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={focused ? "home-sharp" : "home-outline"}
                        color={color}
                        size={iconSize}
                    />
                ),
            }} />
            <Tabs.Screen name="planning" options={{ 
                title: "Planning",
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={focused ? "calendar" : "calendar-outline"}
                        color={color}
                        size={iconSize}
                    />
                ),
            }} />
            <Tabs.Screen name="subjects" options={{ 
                title: "Subjects",
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={focused ? "book" : "book-outline"}
                        color={color}
                        size={iconSize}
                    />
                ),
            }} />
            <Tabs.Screen name="coach" options={{ 
                title: "Coach",
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={focused ? "sparkles" : "sparkles-outline"}
                        color={color}
                        size={iconSize}
                    />
                ),
            }} />
        </Tabs>
    );
}
