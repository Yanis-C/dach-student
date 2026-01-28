import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Text } from "react-native";
import { CommonStyles } from "@/constants/CommonStyles";

const iconSize = 24;

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: "#999393"},
                headerShadowVisible: false,
                headerTintColor: Colors.black,
                headerTitleStyle: { fontFamily: 'Comfortaa_700Bold' },
                tabBarStyle: { 
                    backgroundColor: Colors.white,
                    paddingTop: 8,
                    height: 90,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarLabelStyle: { 
                    fontFamily: 'Comfortaa_400Regular',
                    fontSize: 12,
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
                headerShown: false,
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
